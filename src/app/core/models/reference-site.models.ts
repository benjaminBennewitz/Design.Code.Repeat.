/* src/app/core/models/reference-site.models.ts */

/** Inhalt der Prozess-Section. */
export interface ProcessContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly hint: string;
  readonly steps: readonly ProcessStep[];
}

/** Einzelner Prozessschritt. */
export interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly text: string;
  readonly command: string;
}

/** FAQ-Eintrag. */
export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Inhalt des Kundenbereichs. */
export interface ClientsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly ClientItem[];
}

/** Einzelner Kunde oder Referenzlink. */
export interface ClientItem {
  readonly name: string;
  readonly url: string;
  readonly label: string;
  /** Technischer Stack der referenzierten Website. */
  readonly stack: readonly string[];
}

/** Inhalt der chaotischen CTA-Section. */
export interface CtaContent {
  /** Kleine technische Beschriftung über der CTA. */
  readonly eyebrow: string;
  /** Titel der CTA-Section. */
  readonly title: string;
  /** Bedienhinweis für die interaktiven Bausteine. */
  readonly hint: string;
  /** Einzelne physikähnliche Wortbausteine. */
  readonly words: readonly string[];
}

/** Schmale Qualitäts- und Arbeitsweise-Section. */
export interface BuiltWithoutContent {
  /** Kleine technische Beschriftung über der Section. */
  readonly eyebrow: string;
  /** Kurzer Titel der Section. */
  readonly title: string;
  /** Kurzer erklärender Text. */
  readonly text: string;
  /** Label für bewusst ausgeschlossene Lösungen. */
  readonly withoutLabel: string;
  /** Label für ergänzende gefragte Fähigkeiten. */
  readonly capabilityLabel: string;
  /** Bewusst nicht verwendete generische Hilfsmittel. */
  readonly withoutItems: readonly string[];
  /** Ergänzende, nachgefragte Arbeitsweisen und Qualitätsmerkmale. */
  readonly capabilityItems: readonly string[];
  /** Eyebrow der automatisch aus den Case Studies abgeleiteten Telemetrie. */
  readonly telemetryEyebrow: string;
  /** Titel der globalen Portfolio-Telemetrie. */
  readonly telemetryTitle: string;
  /** Erklärung zur Datenquelle der Portfolio-Telemetrie. */
  readonly telemetryText: string;
  /** Titel des Technologie-Wiederholungs-Charts. */
  readonly recurrenceTitle: string;
  /** Erklärung des Technologie-Wiederholungs-Charts. */
  readonly recurrenceText: string;
  /** Titel des Stack-Breiten-Charts. */
  readonly breadthTitle: string;
  /** Erklärung des Stack-Breiten-Charts. */
  readonly breadthText: string;
}

/** Thema im Kontaktformular. */
export interface ContactTopic {
  /** Stabiler technischer Wert für Formularlogik und Backend-Payload. */
  readonly value: string;
  /** Sichtbares Label des Themas. */
  readonly label: string;
  /** Material-Symbol für die visuelle Chip-Darstellung. */
  readonly icon: string;
}

/** Inhalt des Kontaktformulars. */
export interface ContactContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly modalTitle: string;
  readonly modalCloseLabel: string;
  readonly topicLabel: string;
  readonly topicHint: string;
  readonly topics: readonly ContactTopic[];
  readonly nameLabel: string;
  readonly emailLabel: string;
  readonly messageLabel: string;
  /** Hinweis auf Pflichtfelder im Formular. */
  readonly requiredHint: string;
  /** Zugängliches Label für den Pflichtstern. */
  readonly requiredMarkLabel: string;
  readonly submitLabel: string;
  /** Beschriftung während des serverseitigen Versands. */
  readonly sendingLabel: string;
  readonly successMessage: string;
  readonly errorMessage: string;
  /** Fehlermeldung bei einer serverseitig abgelehnten Eingabe. */
  readonly validationErrorMessage: string;
  /** Fehlermeldung nach fehlgeschlagener CSRF-Erneuerung. */
  readonly csrfErrorMessage: string;
  /** Fehlermeldung bei einer zu großen Anfrage. */
  readonly payloadTooLargeErrorMessage: string;
  /** Fehlermeldung bei zu vielen Anfragen in kurzer Zeit. */
  readonly rateLimitErrorMessage: string;
  /** Fehlermeldung bei vorübergehend nicht verfügbarer Infrastruktur. */
  readonly temporaryErrorMessage: string;
  /** Fehlermeldung bei einem Netzwerkfehler. */
  readonly networkErrorMessage: string;
  /** Allgemeine Fehlermeldung für unerwartete Serverfehler. */
  readonly serverErrorMessage: string;
  /** Fehlermeldung für einen fehlenden Namen. */
  readonly nameRequiredError: string;
  /** Fehlermeldung für einen zu kurzen Namen. */
  readonly nameLengthError: string;
  /** Fehlermeldung für eine fehlende E-Mail-Adresse. */
  readonly emailRequiredError: string;
  /** Fehlermeldung für ein ungültiges E-Mail-Format. */
  readonly emailFormatError: string;
  /** Fehlermeldung für eine fehlende Nachricht. */
  readonly messageRequiredError: string;
  /** Fehlermeldung für eine zu kurze Nachricht. */
  readonly messageLengthError: string;
  /** Beschriftung des unsichtbaren Honeypot-Felds. */
  readonly honeypotLabel: string;
  /** Hinweistext zur Kenntnisnahme der Datenschutzerklärung. */
  readonly privacy: string;
  /** Linktext zur Datenschutzerklärung. */
  readonly privacyLinkLabel: string;
  /** Fehlermeldung für eine nicht bestätigte Datenschutz-Kenntnisnahme. */
  readonly privacyRequiredError: string;
}

/** Inhalt der Dankeseite nach erfolgreichem Kontaktformular-Versand. */
export interface ThankYouContent {
  /** Meta-Titel der Dankeseite. */
  readonly metaTitle: string;
  /** Meta-Description der Dankeseite. */
  readonly metaDescription: string;
  /** Kleine technische Beschriftung über dem Seitentitel. */
  readonly eyebrow: string;
  /** Hauptüberschrift der Dankeseite. */
  readonly title: string;
  /** Erklärungstext nach erfolgreichem Versand. */
  readonly text: string;
  /** Beschriftung des Zurück-Links. */
  readonly backLabel: string;
  /** Titel des dekorativen Statusfensters. */
  readonly dialogTitle: string;
  /** Zugängliche Beschriftung zum Schließen des Statusfensters. */
  readonly dialogCloseLabel: string;
  /** Zeilen im dekorativen Statusfenster. */
  readonly dialogLines: readonly string[];
}

/** Inhalt der eigenständigen 404-Fehlerseite. */
export interface NotFoundPageContent {
  /** Meta-Titel der Fehlerseite. */
  readonly metaTitle: string;
  /** Meta-Description der Fehlerseite. */
  readonly metaDescription: string;
  /** Kleine technische Beschriftung oberhalb des Fehlers. */
  readonly eyebrow: string;
  /** Technische Hauptüberschrift der Fehlerseite. */
  readonly title: string;
  /** Kurzer erklärender Fehlertext. */
  readonly text: string;
  /** Zugängliche Beschriftung der primären Recovery-Aktionen. */
  readonly actionsAriaLabel: string;
  /** Label des Links zur Startseite. */
  readonly homeLabel: string;
  /** Label des Links zum Kontaktbereich. */
  readonly contactLabel: string;
  /** Titel des Recovery-Terminals. */
  readonly terminalTitle: string;
  /** Zugängliche Beschriftung zum Schließen des Recovery-Terminals. */
  readonly terminalCloseLabel: string;
  /** Label für die angeforderte Route. */
  readonly requestedPathLabel: string;
  /** Statische Terminal-Zeilen unterhalb der angeforderten Route. */
  readonly terminalLines: readonly string[];
  /** Zugängliche Beschriftung der Mini-Sitemap. */
  readonly sitemapAriaLabel: string;
  /** Überschrift der Mini-Sitemap. */
  readonly sitemapTitle: string;
  /** Kurzer Hinweis oberhalb der Sitemap-Links. */
  readonly sitemapText: string;
  /** Gruppierte interne Recovery-Links. */
  readonly sitemapGroups: readonly FooterColumn[];
}

/** Inhalt der Impressumsseite. */
export interface ImprintContent {
  /** Meta-Titel der Impressumsseite. */
  readonly metaTitle: string;
  /** Meta-Description der Impressumsseite. */
  readonly metaDescription: string;
  /** Kleine technische Beschriftung über dem Seitentitel. */
  readonly eyebrow: string;
  /** Hauptüberschrift der Impressumsseite. */
  readonly title: string;
  /** Kurze Einordnung oberhalb der Pflichtangaben. */
  readonly intro: string;
  /** Beschriftung des Zurück-Links. */
  readonly backLabel: string;
  /** Inhaltliche Blöcke der Impressumsseite. */
  readonly sections: readonly ImprintSection[];
}

/** Einzelner Informationsblock im Impressum. */
export interface ImprintSection {
  /** Überschrift des Informationsblocks. */
  readonly title: string;
  /** Zeilen des Informationsblocks. */
  readonly lines: readonly string[];
}

/** Footer-Inhalte und Linkgruppen. */
export interface FooterContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  /** Titel des dekorativen Footer-Dialogfensters. */
  readonly dialogTitle: string;
  /** Text des dekorativen Footer-Dialogfensters. */
  readonly dialogText: string;
  /** Zugängliche Beschriftung zum Schließen des Footer-Dialogfensters. */
  readonly dialogCloseLabel: string;
  /** Titel des kleinen Fülli-Hover-Dialogfensters. */
  readonly petDialogTitle: string;
  /** Text des kleinen Fülli-Hover-Dialogfensters. */
  readonly petDialogText: string;
  /** Zugängliche Beschriftung des Fülli-Auslösers. */
  readonly petDialogLabel: string;
  /** Social-Media-Links als kompakte Icon-Gruppe im Footer. */
  readonly socialLinks: readonly FooterLink[];
  readonly columns: readonly FooterColumn[];
}

/** Linkgruppe im Footer. */
export interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

/** Einzelner Footer-Link. */
export interface FooterLink {
  readonly label: string;
  readonly href: string;
}
