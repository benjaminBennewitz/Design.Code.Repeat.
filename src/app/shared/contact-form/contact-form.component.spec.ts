/* src/app/shared/contact-form/contact-form.component.spec.ts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { STUDIO_TRANSLATIONS } from '../../core/data/studio-content';
import { ContactApiError, ContactApiService } from '../../core/services/contact-api.service';
import { LanguageService } from '../../core/services/language.service';
import { ContactFormComponent } from './contact-form.component';

let fixture: ComponentFixture<ContactFormComponent>; // Gerenderte Formularinstanz der aktuellen Prüfung.
let component: ContactFormComponent;                 // Formularzustand der aktuellen Prüfung.
let clock = 0;                                       // Kontrollierbare Zeit seit dem Erstellen des Formulars.
let send: ReturnType<typeof vi.fn>;                  // Kontrollierter API-Versand.
let completeSend: () => void;                        // Abschluss des kontrolliert offenen API-Versands.
let navigate: ReturnType<typeof vi.fn>;              // Kontrollierte Navigation nach dem Versand.

/** Registriert Prüfungen für Submit-Freigabe, Fokus, Erfolg und Wiederholung. */
function registerSubmitTests(): void {
  beforeEach(prepareSubmitTest);
  afterEach(cleanUpSubmitTest);
  it('versendet gültige Werte und setzt erst nach Erfolg zurück', expectSuccessfulSubmit);
  it('behält Werte nach einem API-Fehler und erlaubt einen neuen Versuch', expectFailedSubmit);
  it('verhindert einen zweiten Submit während einer noch offenen API-Anfrage', expectPendingSubmit);
  it('fokussiert bei ungültigen Werten das erste markierte Feld', expectInvalidSubmit);
  it('erhält die bestehende Prüfung des frühen Submit-Zeitpunkts', expectEarlySubmit);
  it('zeigt Feldfehler erst nach Interaktion', expectFieldInteraction);
}

/** Erstellt die kontrollierte Formularinstanz und wartet auf ihre View-Referenzen. */
async function prepareSubmitTest(): Promise<void> {
  clock = 0;
  send = vi.fn().mockResolvedValue(undefined);
  navigate = vi.fn().mockResolvedValue(true);
  vi.spyOn(performance, 'now').mockImplementation(currentTime);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(renderRequestedFrame);
  configureSubmitTest();
  await TestBed.compileComponents();
  fixture = TestBed.createComponent(ContactFormComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  clock = 1800;
}

/** Verbindet die Formularinstanz mit kontrollierten Transport- und Sprachdiensten. */
function configureSubmitTest(): void {
  TestBed.configureTestingModule({
    providers: [
      { provide: ContactApiService, useValue: { send } },
      { provide: Router, useValue: { navigate } },
      { provide: LanguageService, useValue: { content: germanContent, language: germanLanguage } },
    ],
  });
  TestBed.overrideComponent(ContactFormComponent, {
    set: {
      imports: [],
      template: '<form #formElement><input id="invalid-control" aria-invalid="true"></form>',
    },
  });
}

/** Entfernt Formularinstanz, Angular-Testzustand und Browser-Spies. */
function cleanUpSubmitTest(): void {
  fixture?.destroy();
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
}

/** Liefert die kontrollierte Zeit der aktuellen Formularprüfung. */
function currentTime(): number {
  return clock;
}

/** Liefert den zentralen deutschen Content ohne reaktive Sprachumschaltung. */
function germanContent() {
  return STUDIO_TRANSLATIONS.de;
}

/** Liefert den festgelegten deutschen Sprachkontext der aktuellen Prüfung. */
function germanLanguage(): 'de' {
  return 'de';
}

/**
 * Führt den für die Fokussteuerung angeforderten Render-Frame gezielt aus.
 * @param callback Ausstehender Fokusauftrag der Formularinstanz.
 */
function renderRequestedFrame(callback: FrameRequestCallback): number {
  callback(clock);
  return 1;
}

/** Füllt die Formularinstanz mit gültigen Ausgangswerten. */
function fillValidForm(): void {
  component.form.setValue({
    name: ' Max Muster ',
    email: 'MAX@example.com',
    company: '',
    topic: 'website',
    message: 'Eine ausreichend lange Testnachricht.',
    privacy: true,
  });
}

/** Prüft Whitelist, Normalisierung, erfolgreichen Reset und die Danke-Navigation. */
async function expectSuccessfulSubmit(): Promise<void> {
  fillValidForm();
  await component.submit();
  expect(send).toHaveBeenCalledOnce();
  expect(send.mock.calls[0][0]).toMatchObject({ name: 'Max Muster', email: 'max@example.com', website: '' });
  expect(Object.keys(send.mock.calls[0][0]).sort()).toEqual(['email', 'message', 'name', 'website']);
  expect(navigate).toHaveBeenCalledWith(['/danke']);
  expect(component.form.controls.name.value).toBe('');
  expect(component.website()).toBe('');
  expect(component.isSubmitting()).toBe(false);
}

/** Prüft, dass ein Transportfehler Werte erhält und den nächsten Submit nicht blockiert. */
async function expectFailedSubmit(): Promise<void> {
  fillValidForm();
  send.mockRejectedValueOnce(new ContactApiError('rate-limit'));
  await component.submit();
  expect(component.status()).toBe(STUDIO_TRANSLATIONS.de.contactForm.errors.rateLimit);
  expect(component.form.controls.name.value).toBe(' Max Muster ');
  expect(navigate).not.toHaveBeenCalled();
  expect(component.isSubmitting()).toBe(false);
  await component.submit();
  expect(send).toHaveBeenCalledTimes(2);
  expect(navigate).toHaveBeenCalledOnce();
}

/** Simuliert einen offenen Transportauftrag für den Parallel-Submit-Schutz. */
function pendingTransport(): Promise<void> {
  return new Promise(storePendingCompletion);
}

/**
 * Erfasst den Abschluss des kontrolliert offenen Transportauftrags.
 * @param resolve Abschlussfunktion des simulierten API-Versands.
 */
function storePendingCompletion(resolve: () => void): void {
  completeSend = resolve;
}

/** Prüft, dass eine zweite Anfrage während des laufenden Submits nicht startet. */
async function expectPendingSubmit(): Promise<void> {
  fillValidForm();
  send.mockImplementation(pendingTransport);
  /**
   * Erster Submit, der bis zum kontrollierten Transportabschluss offen bleibt.
   */
  const firstSubmit = component.submit();
  await component.submit();
  expect(send).toHaveBeenCalledOnce();
  expect(component.isSubmitting()).toBe(true);
  expect(navigate).not.toHaveBeenCalled();
  completeSend();
  await firstSubmit;
  expect(component.isSubmitting()).toBe(false);
}

/** Prüft den Fokus nach einem ungültigen Submit ohne Kontakt-POST. */
async function expectInvalidSubmit(): Promise<void> {
  fillValidForm();
  component.form.controls.name.setValue('');
  await component.submit();
  expect(send).not.toHaveBeenCalled();
  expect(component.form.touched).toBe(true);
  expect(document.activeElement?.id).toBe('invalid-control');
}

/** Prüft die bestehende frühe Ablehnung eines ansonsten gültigen Submits. */
async function expectEarlySubmit(): Promise<void> {
  fillValidForm();
  clock = 200;
  await component.submit();
  expect(send).not.toHaveBeenCalled();
  expect(component.status()).toBe(STUDIO_TRANSLATIONS.de.contactForm.errors.tooFast);
}

/** Prüft die bisherige Sichtbarkeitsregel für lokalisierte Feldmeldungen. */
function expectFieldInteraction(): void {
  expect(component.errorFor('name')).toBe('');
  component.form.controls.name.markAsTouched();
  expect(component.errorFor('name')).toBe(STUDIO_TRANSLATIONS.de.contactForm.errors.required);
}

describe('ContactFormComponent', registerSubmitTests);
