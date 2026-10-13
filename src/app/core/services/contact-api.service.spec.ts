import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactApiErrorCode, ContactApiService, ContactRequest } from './contact-api.service';

let service: ContactApiService; // Kontaktservice der aktuellen Testinstanz.
let http: HttpTestingController; // Kontrollierte HTTP-Anfragen des aktuellen Tests.
const request: ContactRequest = {
  // Ausschließlich erlaubte Felder einer gültigen Anfrage.
  name: 'Max Mustermann',
  email: 'max@example.com',
  message: 'Thema: Website\n\nEine ausreichend lange Testnachricht.',
  website: '',
}; // Erlaubte Kontakt-Payload für die API-Regressionstests.

/** Registriert Prüfungen für CSRF, Retry, Fehlerklassen und parallele Submits. */
function registerContactTests(): void {
  beforeEach(prepareContactTest);
  afterEach(cleanUpContactTest);
  it('lädt CSRF und sendet exakt den erlaubten Request mit X-CSRFToken', expectAllowedRequest);
  it('erneuert den CSRF-Token nach einem 403 genau einmal und wiederholt den POST', expectCsrfRetry);
  it('führt nach einem zweiten 403 keinen weiteren CSRF-Retry aus', expectRetryLimit);
  it.each([
    [400, 'validation'],
    [413, 'payload-too-large'],
    [429, 'rate-limit'],
    [503, 'unavailable'],
    [500, 'server'],
  ] satisfies readonly (readonly [number, ContactApiErrorCode])[])('ordnet HTTP %i dem Fehler %s zu', expectHttpError);
  it('ordnet einen Netzwerkfehler einem neutralen Netzwerkstatus zu', expectNetworkError);
  it('bricht bei einer ungültigen CSRF-Antwort kontrolliert ab', expectInvalidCsrf);
  it('verhindert einen parallelen zweiten Submit auf Service-Ebene', expectConcurrentSubmit);
}

/** Erstellt voneinander unabhängige Service- und HTTP-Testinstanzen. */
function prepareContactTest(): void {
  TestBed.configureTestingModule({ providers: [ContactApiService, provideHttpClient(), provideHttpClientTesting()] });
  service = TestBed.inject(ContactApiService);
  http = TestBed.inject(HttpTestingController);
}

/** Prüft offene Anfragen und gibt das TestBed auch nach einem Fehler frei. */
function cleanUpContactTest(): void {
  try {
    http.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}

/** Liefert die erwartete CSRF-Anfrage, sobald die Promise-Kette sie erstellt hat. */
function findCsrfRequest(): TestRequest {
  return http.expectOne('/api/csrf/');
}

/** Liefert den erwarteten Kontakt-POST, sobald die Promise-Kette ihn erstellt hat. */
function findPostRequest(): TestRequest {
  return http.expectOne('/api/contact/');
}

/**
 * Beantwortet den CSRF-Handshake nach der tatsächlichen HTTP-Registrierung.
 * @param token Vom Testserver gelieferter CSRF-Token.
 */
async function flushCsrf(token = 'csrf-token'): Promise<void> {
  /**
   * Tatsächlich registrierte Anfrage statt einer angenommenen Microtask-Reihenfolge.
   */
  const csrfRequest = await vi.waitFor(findCsrfRequest);
  expect(csrfRequest.request.method).toBe('GET');
  expect(csrfRequest.request.withCredentials).toBe(true);
  csrfRequest.flush({ csrfToken: token, requestId: 'csrf-request' });
}

/**
 * Beantwortet einen tatsächlich registrierten Kontakt-POST.
 * @param status Gewünschter HTTP-Status.
 * @param statusText Zugehöriger HTTP-Statustext.
 */
async function flushPost(status = 202, statusText = 'Accepted'): Promise<void> {
  /**
   * Nach Abschluss des CSRF-Handshakes registrierter Kontakt-POST.
   */
  const postRequest = await vi.waitFor(findPostRequest);
  respondToPost(postRequest, status, statusText);
}

/**
 * Liefert die gewählte Kontaktantwort an eine bereits erfasste Anfrage.
 * @param postRequest Erwarteter Kontakt-POST.
 * @param status Gewünschter HTTP-Status.
 * @param statusText Zugehöriger HTTP-Statustext.
 */
function respondToPost(postRequest: TestRequest, status: number, statusText: string): void {
  postRequest.flush(
    { status: status === 202 ? 'accepted' : 'error', requestId: 'contact-request' },
    { status, statusText },
  );
}

/** Prüft Payload, Cookies und CSRF-Header einer erfolgreichen Anfrage. */
async function expectAllowedRequest(): Promise<void> {
  /**
   * Noch laufender Submit, dessen HTTP-Anfragen gezielt beantwortet werden.
   */
  const result = service.send(request);
  await flushCsrf();
  /**
   * Nach dem Handshake tatsächlich erzeugter Kontakt-POST.
   */
  const postRequest = await vi.waitFor(findPostRequest);
  expectAllowedPayload(postRequest);
  respondToPost(postRequest, 202, 'Accepted');
  await expect(result).resolves.toBeUndefined();
}

/**
 * Prüft die erlaubten Payload-Felder und die Transportkonfiguration.
 * @param postRequest Vom Service erzeugter Kontakt-POST.
 */
function expectAllowedPayload(postRequest: TestRequest): void {
  expect(postRequest.request.method).toBe('POST');
  expect(postRequest.request.withCredentials).toBe(true);
  expect(postRequest.request.headers.get('X-CSRFToken')).toBe('csrf-token');
  expect(postRequest.request.body).toEqual(request);
  expect(Object.keys(postRequest.request.body as ContactRequest).sort()).toEqual([
    'email',
    'message',
    'name',
    'website',
  ]);
}

/** Prüft, dass genau der zweite POST den erneuerten CSRF-Token verwendet. */
async function expectCsrfRetry(): Promise<void> {
  /**
   * Submit mit einem gezielt abgelehnten ersten CSRF-Token.
   */
  const result = service.send(request);
  await flushCsrf('csrf-old');
  await expectPostTokenAndRespond('csrf-old', 403);
  await flushCsrf('csrf-new');
  await expectPostTokenAndRespond('csrf-new', 202);
  await expect(result).resolves.toBeUndefined();
}

/**
 * Prüft den Token eines POSTs und liefert den gewünschten Status.
 * @param token Erwarteter CSRF-Headerwert.
 * @param status Gewünschter HTTP-Status der Antwort.
 */
async function expectPostTokenAndRespond(token: string, status: number): Promise<void> {
  /**
   * POST des jeweils aktuellen CSRF-Durchlaufs.
   */
  const postRequest = await vi.waitFor(findPostRequest);
  expect(postRequest.request.headers.get('X-CSRFToken')).toBe(token);
  respondToPost(postRequest, status, status === 202 ? 'Accepted' : 'Forbidden');
}

/** Prüft den endgültigen Abbruch nach zwei abgelehnten CSRF-Token. */
async function expectRetryLimit(): Promise<void> {
  /**
   * Submit mit zwei gezielt abgelehnten CSRF-Durchläufen.
   */
  const result = service.send(request);
  await flushCsrf('csrf-old');
  await flushPost(403, 'Forbidden');
  await flushCsrf('csrf-new');
  await flushPost(403, 'Forbidden');
  await expect(result).rejects.toMatchObject({ code: 'csrf', status: 403 });
  http.expectNone('/api/csrf/');
  http.expectNone('/api/contact/');
}

/**
 * Prüft die Zuordnung eines HTTP-Fehlers zur stabilen UI-Fehlerklasse.
 * @param status Simulierter HTTP-Fehlerstatus.
 * @param code Erwartete Fehlerklasse.
 */
async function expectHttpError(status: number, code: ContactApiErrorCode): Promise<void> {
  /**
   * Submit mit gezielt simulierter HTTP-Fehlerantwort.
   */
  const result = service.send(request);
  await flushCsrf();
  await flushPost(status, 'Error');
  await expect(result).rejects.toMatchObject({ code, status });
}

/** Prüft den neutralen Fehlerstatus nach einem fehlgeschlagenen Transport. */
async function expectNetworkError(): Promise<void> {
  /**
   * Submit mit gezielt simulierter Netzwerkunterbrechung.
   */
  const result = service.send(request);
  await flushCsrf();
  /**
   * Kontakt-POST vor der simulierten Netzwerkunterbrechung.
   */
  const postRequest = await vi.waitFor(findPostRequest);
  postRequest.error(new ProgressEvent('error'));
  await expect(result).rejects.toMatchObject({ code: 'network' });
}

/** Prüft, dass ein leerer CSRF-Token keinen Kontakt-POST auslöst. */
async function expectInvalidCsrf(): Promise<void> {
  /**
   * Submit, dessen Handshake mit einem leeren Token beantwortet wird.
   */
  const result = service.send(request);
  await flushCsrf('');
  await expect(result).rejects.toMatchObject({ code: 'csrf' });
  http.expectNone('/api/contact/');
}

/** Prüft den Submit-Schutz unabhängig von der Formular-Komponente. */
async function expectConcurrentSubmit(): Promise<void> {
  /**
   * Erste Anfrage, die bis zur gezielten Serverantwort offen bleibt.
   */
  const firstResult = service.send(request);
  /**
   * Zweite Anfrage während des noch laufenden ersten Submits.
   */
  const secondResult = service.send({ ...request, email: 'other@example.com' });
  await expect(secondResult).rejects.toMatchObject({ code: 'in-progress' });
  await flushCsrf();
  await flushPost();
  await expect(firstResult).resolves.toBeUndefined();
}

describe('ContactApiService', registerContactTests);
