/** @file Katalog mit lokaler Suche, Filterung und Preissortierung. */

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactDraftService } from '../../core/services/contact-draft.service';
import { LanguageService } from '../../core/services/language.service';
import { SeoService } from '../../core/services/seo.service';
import { ShopSampleDownloadComponent } from './shop-sample-download.component';
import { SHOP_COPY } from './shop-copy.data';
import { ShopInformationComponent } from './shop-information.component';
import { SHOP_PRODUCTS, ShopCategory, ShopProduct, formatShopPrice, shopImage } from './shop-products.data';

import { SHOP_CONCEPTS, ShopConcept } from './shop-roadmap.data';

type CategoryFilter = 'all' | ShopCategory;
type SortOrder = 'featured' | 'ascending' | 'descending';

/** Gemeinsame Katalogansicht; Konzepte bleiben vom Kauf- und Downloadmodell getrennt. */
type CatalogEntry =
  | (ShopProduct & { readonly kind: 'product'; readonly description: string })
  | (Omit<ShopConcept, 'description'> & { readonly kind: 'concept'; readonly description: string; readonly cents: number | null });

/** Anwendungsbereiche der Tool-Matrix, unabhängig vom veröffentlichten Produktkatalog. */
const TOOL_MATRIX = [
  {
    name: 'Adobe',
    tools: [
      { id: 'indesign', name: 'InDesign', mark: 'Id', accent: '#ff79b8' },
      { id: 'illustrator', name: 'Illustrator', mark: 'Ai', accent: '#ffba69' },
      { id: 'photoshop', name: 'Photoshop', mark: 'Ps', accent: '#75d9ff' },
    ],
  },
  {
    name: 'Microsoft',
    tools: [
      { id: 'excel', name: 'Excel', mark: 'X', accent: '#72e4a7' },
      { id: 'word', name: 'Word', mark: 'W', accent: '#92b6ff' },
      { id: 'project', name: 'Project', mark: 'P', accent: '#c8a2ff' },
    ],
  },
] as const;

type MatrixTool = (typeof TOOL_MATRIX)[number]['tools'][number]['id'];

/** Öffentliche Vorschau des Produktkatalogs. */
@Component({
  selector: 'dcr-shop-catalog',
  imports: [ShopSampleDownloadComponent, RouterLink, ShopInformationComponent],
  templateUrl: './shop-catalog.component.html',
  styleUrls: ['./shop.scss', './shop-catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopCatalogComponent {
  private readonly router = inject(Router);
  private readonly contactDraft = inject(ContactDraftService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly language = inject(LanguageService).language;
  readonly ui = computed(() => SHOP_COPY[this.language()]);
  readonly categories: readonly CategoryFilter[] = ['all', 'indesign', 'illustrator', 'photoshop', 'excel', 'word', 'project', 'bundle'];
  readonly sorts: readonly SortOrder[] = ['featured', 'ascending', 'descending'];
  readonly featured = SHOP_PRODUCTS.find(product => product.category === 'bundle') ?? SHOP_PRODUCTS[0];
  /** Visuelle Anwendungsbereiche und aktuell ausgewählter Matrix-Knoten. */
  readonly matrixGroups = TOOL_MATRIX;
  readonly activeTool = signal<MatrixTool>('indesign');
  readonly image = shopImage;
  readonly price = formatShopPrice;
  readonly query = computed(() => this.params().get('q') ?? '');
  readonly category = computed(() => this.categories.find(value => value === this.params().get('category')) ?? 'all');
  readonly sort = computed(() => this.sorts.find(value => value === this.params().get('sort')) ?? 'featured');
  readonly free = computed(() => this.params().get('free') === '1');
  /** Filtert und sortiert sämtliche Katalogeinträge gemeinsam. Offene Preise bleiben am Ende. */
  readonly filtered = computed(() => {
    const language = this.language();
    const ui = this.ui();
    const terms = this.query().trim().toLowerCase().split(/\s+/).filter(Boolean);
    const entries: CatalogEntry[] = [
      ...SHOP_PRODUCTS.map(product => ({ ...product, kind: 'product' as const, description: product.copy[language].description })),
      ...SHOP_CONCEPTS.map(concept => ({ ...concept, kind: 'concept' as const, description: concept.description[language], cents: concept.inquiryOnly ? 0 : null })),
    ];
    const matches = entries.filter(entry => {
      const features = entry.kind === 'product' ? entry.copy[language].features : [];
      const text = [entry.name.de, entry.name.en, entry.code, ui[entry.category], entry.description, ...(entry.kind === 'product' ? [entry.slug] : []), ...features].join(' ').toLowerCase();
      return (this.category() === 'all' || entry.category === this.category())
        && (!this.free() || entry.cents === 0)
        && terms.every(term => text.includes(term));
    });
    if (this.sort() === 'featured') return matches;
    const direction = this.sort() === 'ascending' ? 1 : -1;
    return matches.sort((first, second) => {
      if (first.cents === null) return second.cents === null ? 0 : 1;
      if (second.cents === null) return -1;
      return direction * (first.cents - second.cents);
    });
  });

  /** Öffnet das bestehende Kontaktformular mit einem bearbeitbaren Entwurf zur ausgewählten Idee. */
  inquire(entry: Extract<CatalogEntry, { kind: 'concept' }>): void {
    const application = this.ui()[entry.category];
    const message = this.language() === 'de'
      ? `Hallo, ich interessiere mich für ${entry.name[this.language()]} (${application}, ${entry.code}).\n\nMein gewünschter Workflow:\n`
      : `Hello, I am interested in ${entry.name[this.language()]} (${application}, ${entry.code}).\n\nMy intended workflow:\n`;
    this.contactDraft.prepare({ topic: 'software', message });
    void this.router.navigate(['/kontakt']);
  }

  /** Liefert den Planungsstand eines Anwendungsbereichs für die Matrix. */
  matrixStatus(tool: MatrixTool): string {
    if (tool === 'indesign') return this.ui().matrixPreview;
    if (tool === 'excel' || tool === 'word') return this.ui().matrixIdea;
    return this.ui().matrixResearch;
  }

  constructor() {
    effect(() => this.seo.setPage({
      title: 'DCR//TOOLS | Design. Code. Repeat.',
      description: this.ui().intro,
      keywords: ['InDesign', 'Excel', 'DCR Tools'],
    }, '/shop', 'website', 'noindex, follow'));
  }

  /**
   * Spiegelt die Auswahl in der URL, damit Zurücknavigation und Direktaufrufe sie wiederherstellen.
   * @param values Geänderte Filterwerte oder null zum Entfernen.
   */
  update(values: Partial<Record<'q' | 'category' | 'sort' | 'free', string | null>>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: values,
      queryParamsHandling: 'merge',
      replaceUrl: true,
      preserveFragment: true,
      scroll: 'manual',
    });
  }
}
