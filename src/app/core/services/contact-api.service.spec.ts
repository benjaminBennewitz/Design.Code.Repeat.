/**
 * @file Tests für die Contact-API-Schicht.
 * @description Prüft CSRF-Handshake, Request-Whitelist, Retry-Grenze, Fehlerklassen und Doppel-Submit-Schutz.
 */

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactApiErrorCode, ContactApiService, ContactRequest } from './contact-api.service';

describe('ContactApiService', () => {
  let service: ContactApiService;
  let http: HttpTestingController;

  const request: ContactRequest = {
    name: 'Max Mustermann',
    email: 'max@example.com',
    message: 'Thema: Website\n\nEine ausreichend lange Testnachricht.',
    website: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ContactApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  /** Löst den erwarteten CSRF-Request aus und gibt der Promise-Kette einen Microtask zum Fortsetzen. */
  async function flushCsrf(token = 'csrf-token'): Promise<void> {
    const csrfRequest = http.expectOne('/api/csrf/');

    expect(csrfRequest.request.method).toBe('GET');
    expect(csrfRequest.request.withCredentials).toBe(true);

    csrfRequest.flush({ csrfToken: token, requestId: 'csrf-request' });
    await Promise.resolve();
  }

  /** Löst den erwarteten Contact-POST mit einem frei wählbaren HTTP-Status aus. */
  function flushPost(status = 202, statusText = 'Accepted'): void {
    const postRequest = http.expectOne('/api/contact/');

    postRequest.flush(
      { status: status === 202 ? 'accepted' : 'error', requestId: 'contact-request' },
      { status, statusText },
    );
  }

  it('lädt CSRF und sendet exakt den erlaubten Request mit X-CSRFToken', async () => {
    const result = service.send(request);

    await flushCsrf();

    const postRequest = http.expectOne('/api/contact/');
    expect(postRequest.request.method).toBe('POST');
    expect(postRequest.request.withCredentials).toBe(true);
    expect(postRequest.request.headers.get('X-CSRFToken')).toBe('csrf-token');
    expect(postRequest.request.body).toEqual(request);
    expect(Object.keys(postRequest.request.body as ContactRequest).sort()).toEqual(['email', 'message', 'name', 'website']);

    postRequest.flush(
      { status: 'accepted', requestId: 'contact-request' },
      { status: 202, statusText: 'Accepted' },
    );

    await expect(result).resolves.toBeUndefined();
  });

  it('erneuert den CSRF-Token nach einem 403 genau einmal und wiederholt den POST', async () => {
    const result = service.send(request);

    await flushCsrf('csrf-old');

    const firstPost = http.expectOne('/api/contact/');
    expect(firstPost.request.headers.get('X-CSRFToken')).toBe('csrf-old');
    firstPost.flush({ status: 'csrf_failed' }, { status: 403, statusText: 'Forbidden' });
    await Promise.resolve();

    await flushCsrf('csrf-new');

    const secondPost = http.expectOne('/api/contact/');
    expect(secondPost.request.headers.get('X-CSRFToken')).toBe('csrf-new');
    secondPost.flush(
      { status: 'accepted', requestId: 'contact-request' },
      { status: 202, statusText: 'Accepted' },
    );

    await expect(result).resolves.toBeUndefined();
  });

  it('führt nach einem zweiten 403 keinen weiteren CSRF-Retry aus', async () => {
    const result = service.send(request);

    await flushCsrf('csrf-old');
    flushPost(403, 'Forbidden');
    await Promise.resolve();

    await flushCsrf('csrf-new');
    flushPost(403, 'Forbidden');

    await expect(result).rejects.toMatchObject({ code: 'csrf', status: 403 });
    http.expectNone('/api/csrf/');
    http.expectNone('/api/contact/');
  });

  it.each([
    [400, 'validation'],
    [413, 'payload-too-large'],
    [429, 'rate-limit'],
    [503, 'unavailable'],
    [500, 'server'],
  ] satisfies readonly (readonly [number, ContactApiErrorCode])[])('ordnet HTTP %i dem Fehler %s zu', async (status, code) => {
    const result = service.send(request);

    await flushCsrf();
    flushPost(status, 'Error');

    await expect(result).rejects.toMatchObject({ code, status });
  });

  it('ordnet einen Netzwerkfehler einem neutralen Netzwerkstatus zu', async () => {
    const result = service.send(request);

    await flushCsrf();

    const postRequest = http.expectOne('/api/contact/');
    postRequest.error(new ProgressEvent('error'));

    await expect(result).rejects.toMatchObject({ code: 'network' });
  });

  it('bricht bei einer ungültigen CSRF-Antwort kontrolliert ab', async () => {
    const result = service.send(request);
    const csrfRequest = http.expectOne('/api/csrf/');

    csrfRequest.flush({ csrfToken: '', requestId: 'csrf-request' });

    await expect(result).rejects.toMatchObject({ code: 'csrf' });
    http.expectNone('/api/contact/');
  });

  it('verhindert einen parallelen zweiten Submit auf Service-Ebene', async () => {
    const firstResult = service.send(request);
    const secondResult = service.send({ ...request, email: 'other@example.com' });

    await expect(secondResult).rejects.toMatchObject({ code: 'in-progress' });

    await flushCsrf();
    flushPost();
    await expect(firstResult).resolves.toBeUndefined();
  });
});
