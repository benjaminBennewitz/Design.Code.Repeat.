/* src/app/shared/reference-case-study/controllers/catalog-flow-renderer.ts */
/** Beweglicher Punkt im generativen Flow-Feld. */
interface FlowParticle {
  x: number;
  y: number;
  speed: number;
  phase: number;
}
/** Zeichnet ausschließlich die Partikel und deren auslaufende Spuren. */
export class CatalogFlowRenderer {
  private readonly particles: FlowParticle[] = []; // Partikel der aktuell sichtbaren Canvas-Fläche.
  private time = 0;                                // Fortlaufende Phase des trigonometrischen Flow-Feldes.

  /**
   * Verteilt die Partikel auf einer neu dimensionierten Canvas-Fläche.
   * @param rect Sichtbare Abmessungen der Canvas-Fläche.
   */
  seed(rect: DOMRect): void {
    this.particles.length = 0;
    /**
     * Fortlaufende Partikelposition innerhalb des unveränderten Performance-Limits.
     */
    for (let index = 0; index < 180; index++) this.particles.push(createParticle(rect.width, rect.height));
  }

  /**
   * Zeichnet eine vollständige Animationsstufe.
   * @param context Aktiver Canvas-Zeichenkontext.
   * @param rect Sichtbare Abmessungen der Canvas-Fläche.
   */
  draw(context: CanvasRenderingContext2D, rect: DOMRect): void {
    this.time += 0.006;
    fadeParticleTrails(context, rect);
    configureParticleStroke(context);
    /**
     * Aktuell auf der Canvas-Fläche dargestelltes Flow-Partikel.
     */
    for (const particle of this.particles) this.drawParticle(context, rect, particle);
  }

  /**
   * Zeichnet die nächste sichtbare Spur eines Partikels.
   * @param context Aktiver Canvas-Zeichenkontext.
   * @param rect Sichtbare Abmessungen der Canvas-Fläche.
   * @param particle Zu zeichnendes Flow-Partikel.
   */
  private drawParticle(context: CanvasRenderingContext2D, rect: DOMRect, particle: FlowParticle): void {
    /**
     * Vorherige Position als Startpunkt der nächsten Partikelspur.
     */
    const previous = advanceParticle(particle, this.time);
    if (isParticleOutside(particle, rect)) {
      resetParticle(particle, rect);
      return;
    }
    context.strokeStyle = getParticleStroke(particle, rect.width);
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(particle.x, particle.y);
    context.stroke();
  }
}

/**
 * Erzeugt die Ausgangsposition eines Flow-Partikels.
 * @param width Sichtbare Breite der Canvas-Fläche.
 * @param height Sichtbare Höhe der Canvas-Fläche.
 */
function createParticle(width: number, height: number): FlowParticle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.35 + Math.random() * 1.15,
    phase: Math.random() * Math.PI * 2,
  };
}

/**
 * Blendet bisherige Partikelspuren schrittweise aus.
 * @param context Aktiver Canvas-Zeichenkontext.
 * @param rect Sichtbare Abmessungen der Canvas-Fläche.
 */
function fadeParticleTrails(context: CanvasRenderingContext2D, rect: DOMRect): void {
  context.globalCompositeOperation = 'destination-out';
  context.fillStyle = 'rgba(0, 0, 0, 0.045)';
  context.fillRect(0, 0, rect.width, rect.height);
  context.globalCompositeOperation = 'source-over';
}

/**
 * Setzt die gemeinsamen Linienattribute des Flow-Feldes.
 * @param context Aktiver Canvas-Zeichenkontext.
 */
function configureParticleStroke(context: CanvasRenderingContext2D): void {
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 0.85;
}

/**
 * Bewegt ein Partikel und liefert seine bisherige Position.
 * @param particle Zu bewegendes Flow-Partikel.
 * @param time Aktuelle Phase des Flow-Feldes.
 */
function advanceParticle(particle: FlowParticle, time: number): { x: number; y: number } {
  /**
   * Bisherige Position für die Verbindung zur neuen Position.
   */
  const previous = { x: particle.x, y: particle.y };
  /**
   * Bewegungswinkel vor der gemeinsamen Aktualisierung beider Koordinaten.
   */
  const angle = getParticleAngleAt(previous, particle.phase, time);
  particle.x += Math.cos(angle) * particle.speed;
  particle.y += Math.sin(angle) * particle.speed;
  return previous;
}

/**
 * Berechnet den trigonometrischen Bewegungswinkel einer Position.
 * @param position Position vor der Partikelbewegung.
 * @param phase Individueller Phasenversatz des Partikels.
 * @param time Aktuelle Phase des Flow-Feldes.
 */
function getParticleAngleAt(position: { x: number; y: number }, phase: number, time: number): number {
  return (
    (Math.sin(position.x * 0.0065 + time + phase) +
      Math.cos(position.y * 0.0075 - time * 0.9) +
      Math.sin((position.x + position.y) * 0.0028 + time * 1.6)) *
    Math.PI
  );
}

/**
 * Prüft den Randbereich, ab dem eine Spur neu beginnen muss.
 * @param particle Zu prüfendes Flow-Partikel.
 * @param rect Sichtbare Abmessungen der Canvas-Fläche.
 */
function isParticleOutside(particle: FlowParticle, rect: DOMRect): boolean {
  return particle.x < -20 || particle.x > rect.width + 20 || particle.y < -20 || particle.y > rect.height + 20;
}

/**
 * Setzt ein Partikel an einem zufälligen Rand neu ein.
 * @param particle Neu zu positionierendes Flow-Partikel.
 * @param rect Sichtbare Abmessungen der Canvas-Fläche.
 */
function resetParticle(particle: FlowParticle, rect: DOMRect): void {
  /**
   * Zufällig gewählter Startpunkt auf einer der vier Canvas-Kanten.
   */
  const side = Math.floor(Math.random() * 4);
  particle.x = side === 0 ? 0 : side === 1 ? rect.width : Math.random() * rect.width;
  particle.y = side === 2 ? 0 : side === 3 ? rect.height : Math.random() * rect.height;
  particle.speed = 0.35 + Math.random() * 1.15;
  particle.phase = Math.random() * Math.PI * 2;
}

/**
 * Liefert die positionsabhängige Linienfarbe eines Partikels.
 * @param particle Zu zeichnendes Flow-Partikel.
 * @param width Sichtbare Breite der Canvas-Fläche.
 */
function getParticleStroke(particle: FlowParticle, width: number): string {
  return (
    'rgba(255, 79, 216, ' + (0.16 + Math.sin((width > 0 ? particle.x / width : 0) * Math.PI) * 0.22).toFixed(3) + ')'
  );
}
