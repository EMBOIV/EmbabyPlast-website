// Embaby Plast - Product showcase with folder-based Arabic/English structure
// ===== PRODUCT CATALOG =====
// Each row = one catalog entry. Child rows are sellable variants.
// Optional parent rows are grouped using familyKey and can provide family images.
// Required fields for import:
// id, familyKey, familyName, familyNameAr, varianttype, varianttypeAr,
// name, nameAr, DozenPrice, pcsPerCarton, cartonPrice, imageFile, badge, enabled, rowType

var PRODUCT_CATALOG = {
};

var CONTACT_INFO = {
    phoneDigits: '201277793199',
    phoneDisplay: '+2012 777 93 199',
    location: {
        ar: 'المنطقة الصناعية، القاهرة، مصر',
        en: 'Industrial Zone, Cairo, Egypt'
    },
    workingHours: {
        ar: 'السبت - الخميس: 8:00 ص - 5:00 م',
        en: 'Sat - Thu: 8:00 AM - 5:00 PM'
    }
};

var BRAND_INFO = {
    ar: 'إمبابي بلاست',
    en: 'Embaby Plast'
};

// Products page structure toggle:
// true  => show families first, then children on filtering
// false => always show all child products directly
var PRODUCTS_PAGE_SETTINGS = {
    groupByFamily: false
};

function getPhoneTelHref() {
    return 'tel:+' + CONTACT_INFO.phoneDigits;
}

function getWhatsappBaseHref() {
    return 'https://wa.me/' + CONTACT_INFO.phoneDigits;
}

function getWhatsappHrefWithText(text) {
    if (!text) return getWhatsappBaseHref();
    return getWhatsappBaseHref() + '?text=' + encodeURIComponent(text);
}

function getLocalizedLocation(ar) {
    return ar ? CONTACT_INFO.location.ar : CONTACT_INFO.location.en;
}

function getLocalizedWorkingHours(ar) {
    return ar ? CONTACT_INFO.workingHours.ar : CONTACT_INFO.workingHours.en;
}

function syncContactLinks() {
    var ar = isArabic();

    document.querySelectorAll('[data-contact-link="phone"]').forEach(function(link) {
        link.setAttribute('href', getPhoneTelHref());
        if (link.hasAttribute('data-contact-text')) {
            link.textContent = CONTACT_INFO.phoneDisplay;
        }
    });

    document.querySelectorAll('[data-contact-link="whatsapp"]').forEach(function(link) {
        var msg = link.getAttribute('data-whatsapp-message') || '';
        link.setAttribute('href', getWhatsappHrefWithText(msg));
        if (link.hasAttribute('data-contact-text')) {
            link.textContent = CONTACT_INFO.phoneDisplay;
        }
    });

    document.querySelectorAll('[data-contact-content="location"]').forEach(function(el) {
        el.textContent = getLocalizedLocation(ar);
    });

    document.querySelectorAll('[data-contact-content="hours"]').forEach(function(el) {
        el.textContent = getLocalizedWorkingHours(ar);
    });
}

function getCatalogCsvPath() {
    var path = String(window.location.pathname || '').toLowerCase();
    if (path.indexOf('/en/') !== -1 || path.indexOf('/ar/') !== -1) {
        return '../products_template.csv';
    }
    return 'products_template.csv';
}

function parseCsvText(text) {
    var rows = [];
    var currentCell = '';
    var currentRow = [];
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
        var ch = text[i];

        if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (!inQuotes && ch === ',') {
            currentRow.push(currentCell);
            currentCell = '';
            continue;
        }

        if (!inQuotes && (ch === '\n' || ch === '\r')) {
            if (ch === '\r' && text[i + 1] === '\n') i++;
            currentRow.push(currentCell);
            currentCell = '';

            var isEmptyRow = currentRow.every(function(cell) {
                return String(cell || '').trim() === '';
            });

            if (!isEmptyRow) {
                rows.push(currentRow);
            }

            currentRow = [];
            continue;
        }

        currentCell += ch;
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell);
        var isLastEmpty = currentRow.every(function(cell) {
            return String(cell || '').trim() === '';
        });
        if (!isLastEmpty) {
            rows.push(currentRow);
        }
    }

    return rows;
}

function normalizeHeaderName(header) {
    return String(header || '')
        .replace(/^\uFEFF/, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '');
}

function getRowValue(row, possibleKeys) {
    for (var i = 0; i < possibleKeys.length; i++) {
        var key = normalizeHeaderName(possibleKeys[i]);
        if (row.hasOwnProperty(key) && String(row[key] || '').trim() !== '') {
            return String(row[key]).trim();
        }
    }
    return '';
}

function deriveFamilyKeyFromRow(id, name, nameAr, familyName, familyNameAr) {
    var source = familyName || familyNameAr || name || nameAr || String(id || '');
    var normalized = normalizeLookup(source).replace(/[^\u0600-\u06FFa-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return normalized || String(id || '');
}

function isFamilyParentRowType(value) {
    var normalized = normalizeLookup(value);
    return normalized === 'parent'
        || normalized === 'family'
        || normalized === 'header'
        || normalized === 'group';
}

function buildCatalogFromCsvRows(rows) {
    if (!rows || !rows.length) return {};

    var headers = rows[0].map(function(header) {
        return normalizeHeaderName(header);
    });

    var catalog = {};

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i];
        var mapped = {};

        for (var h = 0; h < headers.length; h++) {
            var header = headers[h];
            if (!header) continue;
            mapped[header] = cells[h] != null ? String(cells[h]).trim() : '';
        }

        var id = getRowValue(mapped, ['id']) || String(i);
        var name = getRowValue(mapped, ['name', '\u0627\u0644\u0627\u0633\u0645']);
        var nameAr = getRowValue(mapped, ['nameAr', 'name_ar', 'arabicName', 'arabic_name', '\u0627\u0644\u0627\u0633\u0645\u0628\u0627\u0644\u0639\u0631\u0628\u064A']);
        var familyName = getRowValue(mapped, ['familyName', 'family_name']);
        var familyNameAr = getRowValue(mapped, ['familyNameAr', 'family_name_ar', 'familynamearabic']);
        var familyKey = getRowValue(mapped, ['familyKey', 'family_key']);
        var rowType = getRowValue(mapped, ['rowType', 'row_type', 'recordType', 'record_type', 'entryType', 'entry_type']);
        var varianttype = getRowValue(mapped, ['varianttype', 'variantType', 'type']);
        var varianttypeAr = getRowValue(mapped, ['varianttypeAr', 'variantTypeAr', 'typeAr']);
        var badge = getRowValue(mapped, ['badge']);
        var badgeAr = getRowValue(mapped, ['badgeAr', 'badge_ar']);
        var enabled = getRowValue(mapped, ['enabled', 'active']) || '1';

        if (!rowType && isFamilyParentRowType(varianttypeAr)) {
            rowType = varianttypeAr;
            varianttypeAr = '';
            if (badgeAr === '1') {
                badgeAr = '';
            }
        }

        if (!familyKey) {
            familyKey = deriveFamilyKeyFromRow(id, name, nameAr, familyName, familyNameAr);
        }

        catalog[String(id)] = {
            id: String(id),
            familyKey: String(familyKey),
            familyName: familyName || name,
            familyNameAr: familyNameAr || nameAr || familyName || name,
            varianttype: varianttype,
            varianttypeAr: varianttypeAr,
            name: name,
            nameAr: nameAr,
            DozenPrice: getRowValue(mapped, ['DozenPrice', 'dozen_price', 'price']),
            pcsPerCarton: getRowValue(mapped, ['pcsPerCarton', 'pcs_per_carton', 'pieces_per_carton']),
            cartonPrice: getRowValue(mapped, ['cartonPrice', 'carton_price', 'cartonprize', 'carton_prize']),
            imageFile: getRowValue(mapped, ['imageFile', 'image', 'image_file']),
            badge: badge,
            badgeAr: badgeAr,
            rowType: rowType,
            enabled: enabled
        };
    }

    return catalog;
}

async function loadCatalogFromCsv() {
    if (typeof fetch !== 'function') return false;

    try {
        var response = await fetch(getCatalogCsvPath(), { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('CSV response not OK: ' + response.status);
        }

        var csvText = await response.text();
        var rows = parseCsvText(csvText);
        var csvCatalog = buildCatalogFromCsvRows(rows);

        if (Object.keys(csvCatalog).length) {
            PRODUCT_CATALOG = csvCatalog;
            return true;
        }
    } catch (error) {
        console.warn('Embaby Plast: CSV load failed, using fallback catalog.', error);
    }

    return false;
}

// Detect language from <html lang> attribute
function isArabic() {
    return document.documentElement.getAttribute('lang') === 'ar';
}

// Get image base path relative to current page (pages are in /en/ or /ar/ subfolders)
function getImageBase() {
    return '../images/';
}

function getCurrentPageName() {
    var parts = String(window.location.pathname || '').split('/');
    var file = String(parts[parts.length - 1] || '').toLowerCase();
    if (!file || file.indexOf('.html') === -1) return 'index.html';
    return file;
}

function getSectionHref(isHome, sectionId) {
    return isHome ? ('#' + sectionId) : ('index.html#' + sectionId);
}

function getLangPageHref(targetLang, pageName, currentLang) {
    if (targetLang === currentLang) return pageName;
    return '../' + targetLang + '/' + pageName;
}

function buildSharedHeaderHtml(ctx) {
    var ar = ctx.ar;
    var menuArrow = ar ? 'right' : 'left';
    var menuBack = ar ? 'رجوع' : 'Back';
    var langMobileLabel = ar ? 'English' : 'العربية';
    var langMobileAria = ar ? 'English' : 'Arabic';
    var socialWaTitle = ar ? 'واتساب' : 'WhatsApp';
    var currentLang = ar ? 'ar' : 'en';

    var homeHref = getSectionHref(ctx.isHome, 'home');
    var aboutHref = getSectionHref(ctx.isHome, 'about');
    var whyHref = getSectionHref(ctx.isHome, 'why-choose');
    var contactHref = getSectionHref(ctx.isHome, 'contact');
    var productsHref = 'products.html';

    var enHref = getLangPageHref('en', ctx.pageName, currentLang);
    var arHref = getLangPageHref('ar', ctx.pageName, currentLang);
    var mobileLangHref = ar ? enHref : arHref;
    var mobileLangExtra = ctx.isProduct ? ' id="lang-switch-mobile"' : '';
    var productToggleExtra = ctx.isProduct ? ' id="lang-toggle-link"' : '';

    var homeLabel = ar ? 'الرئيسية' : 'Home';
    var aboutLabel = ar ? 'عن المصنع' : 'About';
    var productsLabel = ar ? 'المنتجات' : 'Products';
    var whyLabel = ar ? 'لماذا نحن' : 'Why Us';
    var contactLabel = ar ? 'اتصل بنا' : 'Contact';

    return ''
        + '<input type="checkbox" id="toggler">'
        + '<label for="toggler" class="fas fa-bars"></label>'
        + '<div class="logo-wrap">'
        + '<a href="index.html" class="logo">Embaby<span>Plast</span></a>'
        + '<div class="lang-mini-switch" aria-label="Language switch">'
        + '<a href="' + enHref + '" class="lang-mini-btn' + (ar ? '' : ' active') + '"' + (ar && ctx.isProduct ? productToggleExtra : '') + ' onclick="localStorage.setItem(\'lang\',\'en\')">EN</a>'
        + '<a href="' + arHref + '" class="lang-mini-btn' + (ar ? ' active' : '') + '"' + (!ar && ctx.isProduct ? productToggleExtra : '') + ' onclick="localStorage.setItem(\'lang\',\'ar\')">AR</a>'
        + '</div>'
        + '</div>'
        + '<nav class="navbar">'
        + '<label for="toggler" class="menu-close"><i class="fas fa-arrow-' + menuArrow + '"></i> <span>' + menuBack + '</span></label>'
        + '<a href="' + homeHref + '">' + homeLabel + '</a>'
        + '<a href="' + aboutHref + '">' + aboutLabel + '</a>'
        + '<a href="' + productsHref + '">' + productsLabel + '</a>'
        + '<a href="' + whyHref + '">' + whyLabel + '</a>'
        + '<a href="' + contactHref + '">' + contactLabel + '</a>'
        + '<a href="' + mobileLangHref + '" class="lang-switch-mobile"' + mobileLangExtra + ' onclick="localStorage.setItem(\'lang\',\'' + (ar ? 'en' : 'ar') + '\')" aria-label="' + langMobileAria + '">' + langMobileLabel + '</a>'
        + '<div class="nav-social">'
        + '<a href="' + getWhatsappBaseHref() + '" target="_blank" rel="noreferrer" aria-label="WhatsApp" title="' + socialWaTitle + '"><i class="fab fa-whatsapp"></i></a>'
        + '</div>'
        + '</nav>'
        + '<label for="toggler" class="menu-overlay"></label>';
}

function buildSharedFooterHtml(ar) {
    var brandDesc = ar
        ? 'مصنع تصنيع أمشاط بلاستيكية دقيقة. نوفر أمشاط جملة متينة للموزعين.'
        : 'Precision plastic comb manufacturing factory. Supplying durable wholesale combs for distributors worldwide.';

    var quickLinksTitle = ar ? 'روابط سريعة' : 'Quick Links';
    var homeLabel = ar ? 'الرئيسية' : 'Home';
    var aboutLabel = ar ? 'عن المصنع' : 'About Factory';
    var productsLabel = ar ? 'المنتجات' : 'Products';
    var contactLabel = ar ? 'اتصل بنا' : 'Contact';

    var productsColTitle = ar ? 'المنتجات' : 'Products';
    var allProductsLabel = ar ? 'جميع المنتجات' : 'All Products';
    var browseCatalogLabel = ar ? 'تصفح الكتالوج' : 'Browse Catalog';
    var requestOrderLabel = ar ? 'اطلب الآن' : 'Request Order';

    var contactTitle = ar ? 'تواصل المصنع' : 'Factory Contact';
    var waLabel = ar ? 'واتساب' : 'WhatsApp';
    var location = getLocalizedLocation(ar);
    var currentYear = String(new Date().getFullYear());

    var copyright = ar
        ? ('&copy; ' + currentYear + ' ' + BRAND_INFO.ar + '. جميع الحقوق محفوظة. | مصنع منتجات بلاستيكية')
        : ('&copy; ' + currentYear + ' ' + BRAND_INFO.en + '. All rights reserved. | Plastic Products Factory');

    return ''
        + '<div class="footer-top">'
        + '<div class="footer-brand">'
        + '<a href="index.html" class="footer-logo">Embaby<span>Plast</span></a>'
        + '<p>' + brandDesc + '</p>'
        + '</div>'
        + '<div class="footer-links">'
        + '<h3>' + quickLinksTitle + '</h3>'
        + '<a href="index.html#home">' + homeLabel + '</a>'
        + '<a href="index.html#about">' + aboutLabel + '</a>'
        + '<a href="products.html">' + productsLabel + '</a>'
        + '<a href="index.html#contact">' + contactLabel + '</a>'
        + '</div>'
        + '<div class="footer-links">'
        + '<h3>' + productsColTitle + '</h3>'
        + '<a href="products.html">' + allProductsLabel + '</a>'
        + '<a href="products.html">' + browseCatalogLabel + '</a>'
        + '<a href="index.html#contact">' + requestOrderLabel + '</a>'
        + '</div>'
        + '<div class="footer-contact">'
        + '<h3>' + contactTitle + '</h3>'
        + '<a href="' + getPhoneTelHref() + '"><i class="fas fa-phone"></i> ' + CONTACT_INFO.phoneDisplay + '</a>'
        + '<a href="' + getWhatsappBaseHref() + '" target="_blank" rel="noreferrer"><i class="fab fa-whatsapp"></i> ' + waLabel + '</a>'
        + '<p><i class="fas fa-location-dot"></i> ' + location + '</p>'
        + '<div class="social-links">'
        + '<a href="' + getWhatsappBaseHref() + '" class="social-link" target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="footer-bottom">'
        + '<p>' + copyright + '</p>'
        + '</div>';
}

function renderSharedLayout() {
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');
    if (!header && !footer) return;

    var ar = isArabic();
    var pageName = getCurrentPageName();
    var ctx = {
        ar: ar,
        pageName: pageName,
        isHome: pageName === 'index.html',
        isProduct: pageName === 'product.html'
    };

    if (header) {
        header.innerHTML = buildSharedHeaderHtml(ctx);
    }

    if (footer) {
        footer.innerHTML = buildSharedFooterHtml(ar);
    }
}

function toNumberPrice(value) {
    var num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function getNumericPrice(product) {
    return toNumberPrice(product.DozenPrice);
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getProductName(product, ar) {
    if (ar) {
        if (product.nameAr) return product.nameAr;
        var famAr = product.familyNameAr || product.familyName || '';
        var varAr = product.varianttypeAr || product.varianttype || '';
        return (famAr + (varAr ? ' - ' + varAr : '')).trim();
    }
    if (product.name) return product.name;
    var fam = product.familyName || product.familyNameAr || '';
    var variant = product.varianttype || product.varianttypeAr || '';
    return (fam + (variant ? ' - ' + variant : '')).trim();
}

function getProductImageFile(product) {
    return product.imageFile || (String(product.id) + '.jpg');
}

function isFamilyParentRow(product) {
    return Boolean(product) && isFamilyParentRowType(product.rowType);
}

function handleProductImageError(img) {
    if (!img) return;
    img.onerror = null;
    img.classList.add('is-hidden');
    img.setAttribute('aria-hidden', 'true');

    var frame = img.parentNode;
    if (frame && frame.classList) {
        frame.classList.add('is-missing-image');
    }
}

function buildProductImageHtml(imageSrc, productName, imgClass) {
    var classAttr = imgClass ? ' class="' + escapeHtml(imgClass) + '"' : '';
    return ''
        + '<div class="product-image-frame">'
        + '<img' + classAttr + ' src="' + imageSrc + '" alt="' + escapeHtml(productName) + '" onerror="handleProductImageError(this)">'
        + '<div class="product-image-fallback" aria-hidden="true">' + escapeHtml(productName) + '</div>'
        + '</div>';
}

function isProductEnabled(product) {
    var raw = String(product.enabled == null ? '1' : product.enabled).trim().toLowerCase();
    return !(raw === '0' || raw === 'false' || raw === 'no' || raw === 'off' || raw === 'disabled');
}

function normalizeBadge(value) {
    return String(value || '').trim().toLowerCase();
}

function normalizeLookup(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\u0640]/g, '')
        .replace(/[\u064B-\u065F]/g, '')
        .replace(/[\u0622\u0623\u0625]/g, '\u0627')
        .replace(/\u0649/g, '\u064A')
        .replace(/\u0629/g, '\u0647')
        .replace(/\s+/g, ' ');
}

function getVariantTypeEn(product) {
    return product.varianttype || '';
}

function getVariantTypeAr(product) {
    return product.varianttypeAr || '';
}

function getVariantTypeLabel(product, ar) {
    if (ar) return getVariantTypeAr(product) || getVariantTypeEn(product) || '';
    return getVariantTypeEn(product) || getVariantTypeAr(product) || '';
}

function getFilterKey(value) {
    return normalizeLookup(value)
        .replace(/[^\u0600-\u06FFa-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getBadgeClass(value) {
    var badge = normalizeLookup(value);
    if (!badge) return '';
    if (badge.indexOf('hot') !== -1 || badge.indexOf('\u0633\u0627\u062E\u0646') !== -1) return '';
    if (
        badge.indexOf('most') !== -1
        || badge.indexOf('sell') !== -1
        || badge.indexOf('best') !== -1
        || badge.indexOf('\u0627\u0643\u062B\u0631') !== -1
        || badge.indexOf('\u0645\u0628\u064A\u0639') !== -1
    ) return 'bestseller';
    if (badge.indexOf('popular') !== -1 || badge.indexOf('\u0634\u0627\u0626\u0639') !== -1) return 'popular';
    if (badge.indexOf('new') !== -1 || badge.indexOf('\u062C\u062F\u064A\u062F') !== -1) return 'new';
    return 'new';
}

function getBadgeLabel(value, ar) {
    var badgeClass = getBadgeClass(value);
    if (!badgeClass) return '';
    if (badgeClass === 'bestseller') return ar ? 'الأكثر مبيعاً' : 'Most Selling';
    if (badgeClass === 'popular') return ar ? 'شائع' : 'Popular';
    return ar ? 'جديد' : 'New';
}

function getCatalogArray() {
    var all = Object.keys(PRODUCT_CATALOG).map(function(id) {
        return PRODUCT_CATALOG[id];
    });

    // Collect family keys whose parent row is explicitly disabled.
    var disabledFamilies = {};
    all.forEach(function(product) {
        if (isFamilyParentRow(product) && !isProductEnabled(product)) {
            disabledFamilies[String(product.familyKey)] = true;
        }
    });

    return all.filter(function(product) {
        if (!isProductEnabled(product)) return false;
        if (!isFamilyParentRow(product) && disabledFamilies[String(product.familyKey)]) return false;
        return true;
    });
}

function getVariantCatalogArray() {
    return getCatalogArray().filter(function(product) {
        return !isFamilyParentRow(product);
    });
}

function buildFamilies(products) {
    var map = {};

    products.forEach(function(product) {
        var key = String(product.familyKey || product.id);
        if (!map[key]) {
            map[key] = {
                key: key,
                familyName: '',
                familyNameAr: '',
                variantType: '',
                variantTypeAr: '',
                parent: null,
                variants: []
            };
        }

        if (isFamilyParentRow(product)) {
            map[key].parent = product;
            map[key].familyName = product.familyName || '';
            map[key].familyNameAr = product.familyNameAr || product.nameAr || product.familyName || '';
            map[key].variantType = getVariantTypeEn(product) || map[key].variantType;
            map[key].variantTypeAr = getVariantTypeAr(product) || map[key].variantTypeAr;
            return;
        }

        if (!map[key].variantType) {
            map[key].variantType = getVariantTypeEn(product);
        }
        if (!map[key].variantTypeAr) {
            map[key].variantTypeAr = getVariantTypeAr(product);
        }

        map[key].variants.push(product);
    });

    return Object.keys(map).map(function(key) {
        var family = map[key];
        if (!family.variants.length) return null;
        var minPrice = 0;

        family.variants.forEach(function(variant) {
            var price = getNumericPrice(variant);
            if (price > 0 && (minPrice === 0 || price < minPrice)) {
                minPrice = price;
            }
        });

        family.minPrice = minPrice;
        family.badge = family.parent ? (family.parent.badge || '') : '';
        family.badgeAr = family.parent ? (family.parent.badgeAr || '') : '';
        for (var i = 0; i < family.variants.length; i++) {
            if (!family.badge && normalizeBadge(family.variants[i].badge)) {
                family.badge = family.variants[i].badge;
            }
            if (!family.badgeAr && normalizeBadge(family.variants[i].badgeAr)) {
                family.badgeAr = family.variants[i].badgeAr;
            }
            if (family.badge && family.badgeAr) {
                break;
            }
        }

        return family;
    }).filter(Boolean);
}

function getPriceText(product, ar) {
    var price = getNumericPrice(product);
    if (price > 0) {
        return ar ? (price.toFixed(2) + ' \u062C.\u0645') : ('EGP ' + price.toFixed(2));
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
}

function getDozensPerCarton(product) {
    var pcsRaw = product.pcsPerCarton;
    if (pcsRaw == null) return '';

    var pcsText = String(pcsRaw).trim();
    if (!pcsText) return '';

    var pcs = Number(pcsText);
    if (Number.isFinite(pcs) && pcs > 0) return String(pcs);

    return pcsText;
}

function getCartonPriceText(product, ar) {
    var carton = toNumberPrice(product.cartonPrice);
    if (carton <= 0) {
        var dozenPrice = getNumericPrice(product);
        var dozens = Number(getDozensPerCarton(product));
        if (dozenPrice > 0 && Number.isFinite(dozens) && dozens > 0) {
            carton = dozenPrice * dozens;
        }
    }

    if (carton > 0) {
        return ar ? (carton.toFixed(2) + ' \u062C.\u0645') : ('EGP ' + carton.toFixed(2));
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
}

// ===== SHARED VARIANT CARD BUILDER =====
// Used by both the product details page and the catalog search results.
// opts = {
//   extraClasses : extra CSS classes on the <article> wrapper (default: '')
//   extraAttrs   : extra attribute string on the <article> wrapper (default: '')
//   showBadge    : show product badge (default: false)
// }
function buildVariantCardHtml(item, ar, imgBase, opts) {
    opts = opts || {};
    var productName = getProductName(item, ar);
    var imageHtml = buildProductImageHtml(imgBase + escapeHtml(getProductImageFile(item)), productName, 'product-variant-image');
    var priceText   = getPriceText(item, ar);
    var cartonPriceText = getCartonPriceText(item, ar);
    var dozensPerCarton = getDozensPerCarton(item);
    var priceLabel  = ar ? '\u0633\u0639\u0631 \u0627\u0644\u062F\u0633\u062A\u0629' : 'Dozen Price';
    var cartonPriceLabel = ar ? '\u0633\u0639\u0631 \u0627\u0644\u0643\u0631\u062A\u0648\u0646\u0629' : 'Carton Price';
    var dozenLabel  = ar ? '\u0639\u062F\u062F \u0627\u0644\u062F\u0633\u062A\u0629 \u0641\u064A \u0627\u0644\u0643\u0631\u062A\u0648\u0646\u0629' : 'Dozens Per Carton';
    var btnWhatsapp = ar ? '\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628' : 'Contact via WhatsApp';
    var waMsg = ar
        ? '\u0645\u0631\u062D\u0628\u0627\u064B \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A! \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646: ' + productName
        : ('Hello ' + BRAND_INFO.en + '! I would like to inquire about: ' + productName);

    var extraClasses = opts.extraClasses ? ' ' + opts.extraClasses : '';
    var extraAttrs   = opts.extraAttrs   ? ' ' + opts.extraAttrs   : '';

    var badgeHtml = '';
    if (opts.showBadge) {
        var badgeRaw   = ar ? (item.badgeAr || item.badge) : (item.badge || item.badgeAr);
        var badgeLabel = getBadgeLabel(badgeRaw, ar);
        var badgeClass = getBadgeClass(badgeRaw);
        badgeHtml = badgeLabel ? '<span class="product-badge ' + escapeHtml(badgeClass) + '">' + escapeHtml(badgeLabel) + '</span>' : '';
    }

    return ''
        + '<article class="product-variant-card' + extraClasses + '" tabindex="0" aria-label="' + escapeHtml(productName) + '"' + extraAttrs + '>'
        + badgeHtml
        + '<div class="images">'
        + imageHtml
        + '</div>'
        + '<div class="content">'
        + '<h3>' + escapeHtml(productName) + '</h3>'
        + '<p class="product-price product-variant-price"><span class="price-label">' + priceLabel + ':</span><span class="product-variant-price-value">' + escapeHtml(priceText) + '</span></p>'
        + '<p class="product-dozen-qty"><span class="qty-label">' + dozenLabel + ':</span><span class="qty-value"> ' + escapeHtml(dozensPerCarton || '-') + '</span></p>'
        + '<p class="product-carton-price"><span class="qty-label">' + cartonPriceLabel + ':</span><span class="qty-value"> ' + escapeHtml(cartonPriceText) + '</span></p>'
        + '</div>'
        + '<div class="icons">'
        + '<a href="' + getWhatsappHrefWithText(waMsg) + '" target="_blank" rel="noopener noreferrer" class="btn-cart product-variant-wa">' + btnWhatsapp + '</a>'
        + '</div>'
        + '</article>';
}
// ========================================

function getStartsFromText(minPrice, ar) {
    if (minPrice > 0) {
        return ar ? (minPrice.toFixed(2) + ' \u062C.\u0645') : ('EGP ' + minPrice.toFixed(2));
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
}

function getHighestPriceVariant(variants) {
    var highest = null;
    var highestPrice = -1;

    for (var i = 0; i < variants.length; i++) {
        var variant = variants[i];
        var price = getNumericPrice(variant);
        if (price > highestPrice) {
            highest = variant;
            highestPrice = price;
        }
    }

    return highest || variants[0] || null;
}

function getFamilyCardProduct(family) {
    if (family && family.parent && family.parent.imageFile) {
        return family.parent;
    }
    return getHighestPriceVariant(family ? family.variants : []);
}

function getFamilyVariants(product) {
    var familyKey = String(product.familyKey || product.id);
    return getVariantCatalogArray().filter(function(item) {
        return String(item.familyKey || item.id) === familyKey;
    });
}

function buildRecommendations(currentProduct, ar, imgBase) {
    var allFamilies = buildFamilies(getCatalogArray());
    var currentFamilyKey = String(currentProduct.familyKey || currentProduct.id);
    var candidates = allFamilies.filter(function(family) {
        return String(family.key) !== currentFamilyKey;
    });

    for (var i = candidates.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = temp;
    }

    var picked = candidates.slice(0, 3);
    if (!picked.length) return '';

    var heading = ar ? 'قد يعجبك أيضاً' : 'You may also like';
    var detailsLabel = ar ? 'عرض التفاصيل' : 'View Details';
    var cards = picked.map(function(family) {
        var topVariant = getHighestPriceVariant(family.variants);
        var displayProduct = getFamilyCardProduct(family) || topVariant;
        var familyTitle = ar ? family.familyNameAr : family.familyName;
        var startsFrom = getStartsFromText(family.minPrice, ar);
        var recommendationImageHtml = buildProductImageHtml(imgBase + escapeHtml(getProductImageFile(displayProduct)), getProductName(displayProduct, ar), 'recommendation-image');
        return ''
            + '<article class="recommendation-card" data-detail-url="product.html?id=' + escapeHtml(topVariant.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(familyTitle) + '">'
            + '<div class="recommendation-image-wrap">' + recommendationImageHtml + '</div>'
            + '<h4>' + escapeHtml(familyTitle) + '</h4>'
            + '<p class="recommendation-price">' + (ar ? 'السعر يبدأ من: ' : 'Price starts from: ') + escapeHtml(startsFrom) + '</p>'
            + '<a class="recommendation-link" href="product.html?id=' + escapeHtml(topVariant.id) + '">' + detailsLabel + '</a>'
            + '</article>';
    }).join('');

    return ''
        + '<section class="product-recommendations">'
        + '<h3>' + heading + '</h3>'
        + '<div class="product-recommendations-grid">' + cards + '</div>'
        + '</section>';
}

function ensureProductImageLightbox() {
    var lightbox = document.getElementById('product-image-lightbox');
    if (lightbox) return lightbox;

    document.body.insertAdjacentHTML('beforeend', ''
        + '<div class="product-image-lightbox" id="product-image-lightbox" aria-hidden="true">'
        + '<button type="button" class="product-image-lightbox-close" id="product-image-lightbox-close" aria-label="Close image preview">&times;</button>'
        + '<img id="product-image-lightbox-img" src="" alt="">'
        + '</div>');

    lightbox = document.getElementById('product-image-lightbox');
    var closeBtn = document.getElementById('product-image-lightbox-close');

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeLightbox();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    return lightbox;
}

function renderProductConfigPage() {
    var container = document.querySelector('.product-config-container');
    var pageTitle = document.getElementById('product-page-title');
    if (!container) return;

    var ar = isArabic();
    var params = new URLSearchParams(window.location.search);
    var productId = params.get('id');
    var product = PRODUCT_CATALOG[productId];
    var imgBase = getImageBase();

    if (!product || !isProductEnabled(product)) {
        var notFoundMsg = ar ? '\u0627\u0644\u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F.' : 'Product not found.';
        var backMsg = ar ? '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0643\u062A\u0627\u0644\u0648\u062C' : 'Back to Catalog';
        container.innerHTML = '<p>' + notFoundMsg + ' <a href="products.html">' + backMsg + '</a></p>';
        return;
    }

    var familyKey = String(product.familyKey || product.id);
    var family = buildFamilies(getCatalogArray()).find(function(item) {
        return String(item.key) === familyKey;
    });
    var familyName = ar
        ? ((family && family.familyNameAr) || (family && family.familyName) || product.familyNameAr || product.familyName || product.nameAr || product.name)
        : ((family && family.familyName) || (family && family.familyNameAr) || product.familyName || product.familyNameAr || product.name || product.nameAr);
    if (pageTitle) pageTitle.textContent = familyName;
    document.title = familyName + (ar ? (' - ' + BRAND_INFO.ar) : (' - ' + BRAND_INFO.en));

    var variants = getFamilyVariants(product).slice().sort(function(a, b) {
        var pa = getNumericPrice(a);
        var pb = getNumericPrice(b);

        // Keep "on request" (0) variants at the end, then sort ascending by price.
        if (pa === 0 && pb > 0) return 1;
        if (pb === 0 && pa > 0) return -1;
        return pa - pb;
    });
    var lblVariant = ar ? '\u0627\u0644\u0623\u0646\u0648\u0627\u0639' : 'Variants';
    var btnBack = ar ? '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0643\u062A\u0627\u0644\u0648\u062C' : 'Back to Catalog';
    var initialVariant = getHighestPriceVariant(variants) || product;

    var langToggle = document.getElementById('lang-toggle-link');
    var langMobile = document.getElementById('lang-switch-mobile');
    var otherLangFolder = ar ? '../en/' : '../ar/';
    var otherProductUrl = otherLangFolder + 'product.html?id=' + initialVariant.id;
    if (langToggle) langToggle.href = otherProductUrl;
    if (langMobile) langMobile.href = otherProductUrl;

    var cardsMarkup = variants.map(function(item) {
        return buildVariantCardHtml(item, ar, imgBase, {
            showBadge: false
        });
    }).join('');

    container.innerHTML = ''
        + '<div class="product-config-card product-variants-layout">'
        + '<div class="product-config-form">'
        + '<div class="product-variant-options">'
        + '<p class="variant-options-label">' + lblVariant + '</p>'
        + '<div class="product-variants-grid">' + cardsMarkup + '</div>'
        + '</div>'
        + '<div class="product-config-actions">'
        + '<a href="products.html" class="btn btn-outline-dark">' + btnBack + '</a>'
        + '</div>'
        + '</div>'
        + '</div>'
        + buildRecommendations(product, ar, imgBase);

    var lightbox = ensureProductImageLightbox();
    var lightboxImg = document.getElementById('product-image-lightbox-img');
    if (lightbox && lightboxImg) {
        container.querySelectorAll('.product-variant-card .images img').forEach(function(img) {
            img.classList.add('clickable-preview');
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    container.querySelectorAll('.recommendation-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.recommendation-link')) return;
            window.location.href = this.dataset.detailUrl;
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = this.dataset.detailUrl;
            }
        });
    });

}

document.addEventListener('DOMContentLoaded', async function() {
    renderSharedLayout();
    syncContactLinks();
    await loadCatalogFromCsv();

    var menuToggler = document.getElementById('toggler');
    if (menuToggler) {
        document.querySelectorAll('header .navbar a').forEach(function(link) {
            link.addEventListener('click', function() { menuToggler.checked = false; });
        });
    }

    var productsSection = document.querySelector('.products.luxury-grid');
    if (productsSection) {
        var ar = isArabic();
        var imgBase = getImageBase();
        var boxContainer = productsSection.querySelector('.box-container');
        var totalCountEl = document.getElementById('products-total-count');
        var products = getVariantCatalogArray();
        var families = buildFamilies(getCatalogArray());
        var startsFromLabel = ar ? '\u0627\u0644\u0633\u0639\u0631 \u064A\u0628\u062F\u0623 \u0645\u0646:' : 'Price starts from:';
        var viewLabel = ar ? '\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644' : 'View Details';

        function buildProductSearchText(item) {
            return normalizeLookup([
                item.familyName, item.familyNameAr,
                item.varianttype, item.varianttypeAr,
                item.name, item.nameAr
            ].join(' '));
        }

        function makeFamilyCardHtml(family) {
            var initial = getHighestPriceVariant(family.variants);
            var displayProduct = getFamilyCardProduct(family) || initial;
            var familyTitle = ar ? family.familyNameAr : family.familyName;
            var startsFrom = getStartsFromText(family.minPrice, ar);
            var badgeRaw = ar ? (family.badgeAr || family.badge) : (family.badge || family.badgeAr);
            var badgeLabel = getBadgeLabel(badgeRaw, ar);
            var badgeClass = getBadgeClass(badgeRaw);
            var typeLabel = getVariantTypeLabel(family, ar);
            var typeFilterKey = getFilterKey(typeLabel);
            var familyImageHtml = buildProductImageHtml(imgBase + escapeHtml(getProductImageFile(displayProduct)), getProductName(displayProduct, ar), 'product-family-image');

            return ''
                + '<div class="box" data-family-key="' + escapeHtml(family.key) + '" data-type-key="' + escapeHtml(typeFilterKey) + '" data-detail-url="product.html?id=' + escapeHtml(initial.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(familyTitle) + '">'
                + (badgeLabel ? '<span class="product-badge ' + escapeHtml(badgeClass) + '">' + escapeHtml(badgeLabel) + '</span>' : '')
                + '<div class="images">'
                + familyImageHtml
                + '</div>'
                + '<div class="content">'
                + '<h3>' + escapeHtml(familyTitle) + '</h3>'
                + (typeLabel ? '<p class="product-type-tag">' + escapeHtml(ar ? ('النوع: ' + typeLabel) : ('Type: ' + typeLabel)) + '</p>' : '')
                + '<div class="product-price product-variant-price"><span class="price-label">' + startsFromLabel + '</span><span class="product-variant-price-value">' + escapeHtml(startsFrom) + '</span></div>'
                + '</div>'
                + '<div class="icons">'
                + '<a href="product.html?id=' + escapeHtml(initial.id) + '" class="btn-cart product-view-link">' + viewLabel + '</a>'
                + '</div>'
                + '</div>';
        }

        function makeVariantCardHtml(item) {
            var typeLabel = getVariantTypeLabel(item, ar);
            var typeFilterKey = getFilterKey(typeLabel);
            return buildVariantCardHtml(item, ar, imgBase, {
                extraClasses: 'box variant-result-card',
                extraAttrs: 'data-family-key="' + escapeHtml(String(item.familyKey || item.id)) + '" data-type-key="' + escapeHtml(typeFilterKey) + '"',
                showBadge: true
            });
        }

        function bindCardInteractions() {
            var boxes = productsSection.querySelectorAll('.box-container .box');
            boxes.forEach(function(box) {
                if (!box.dataset.detailUrl) return;
                box.addEventListener('click', function(e) {
                    if (e.target.closest('.product-view-link') || e.target.closest('.product-variant-wa')) return;
                    window.location.href = this.dataset.detailUrl;
                });
                box.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = this.dataset.detailUrl;
                    }
                });
            });
        }

        var searchBar = document.querySelector('.products-search');
        var typeFilter = null;
        if (searchBar) {
            var typeMap = {};
            families.forEach(function(family) {
                var familyTypeLabel = getVariantTypeLabel(family, ar);
                var familyTypeKey = getFilterKey(familyTypeLabel);
                if (familyTypeLabel && familyTypeKey) {
                    typeMap[familyTypeKey] = familyTypeLabel;
                }
            });

            var typeKeys = Object.keys(typeMap).sort(function(a, b) {
                return String(typeMap[a]).localeCompare(String(typeMap[b]), ar ? 'ar' : 'en', { sensitivity: 'base' });
            });

            if (typeKeys.length) {
                var filterWrap = document.createElement('div');
                filterWrap.className = 'products-type-filter-wrap';
                filterWrap.innerHTML = ''
                    + '<label class="products-type-filter-label" for="product-type-filter">' + (ar ? 'تصفية حسب النوع' : 'Filter by type') + '</label>'
                    + '<select id="product-type-filter" class="products-type-filter">'
                    + '<option value="">' + (ar ? 'كل الأنواع' : 'All Types') + '</option>'
                    + typeKeys.map(function(key) {
                        return '<option value="' + escapeHtml(key) + '">' + escapeHtml(typeMap[key]) + '</option>';
                    }).join('')
                    + '</select>';

                searchBar.insertAdjacentElement('afterend', filterWrap);
                typeFilter = document.getElementById('product-type-filter');
            }
        }

        function applyFilters() {
            var searchInput = document.getElementById('product-search');
            var query = searchInput ? normalizeLookup(searchInput.value) : '';
            var selectedType = typeFilter ? typeFilter.value : '';
            var noResults = document.getElementById('no-results');
            var visibleCount = 0;
            var hasActiveFilter = Boolean(query || selectedType);
            var showChildrenDirectly = !PRODUCTS_PAGE_SETTINGS.groupByFamily || hasActiveFilter;

            if (showChildrenDirectly) {
                var matchedProducts = products.filter(function(item) {
                    var typeKey = getFilterKey(getVariantTypeLabel(item, ar));
                    var matchesType = !selectedType || typeKey === selectedType;
                    if (!matchesType) return false;
                    if (!query) return true;
                    return buildProductSearchText(item).indexOf(query) !== -1;
                });

                if (boxContainer) boxContainer.innerHTML = matchedProducts.map(makeVariantCardHtml).join('');
                visibleCount = matchedProducts.length;
            } else {
                if (boxContainer) boxContainer.innerHTML = families.map(makeFamilyCardHtml).join('');
                visibleCount = families.length;
            }

            bindCardInteractions();

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? '' : 'none';
            }

            if (totalCountEl) {
                var totalBaseCount = showChildrenDirectly ? products.length : families.length;
                var totalText = ar
                    ? ('إجمالي المنتجات: ' + totalBaseCount)
                    : ('Total products: ' + totalBaseCount);
                var visibleText = ar
                    ? (' | المعروض: ' + visibleCount)
                    : (' | Showing: ' + visibleCount);
                totalCountEl.textContent = totalText + visibleText;
            }
        }

        // Apply initial search state
        applyFilters();

        // Search input listener
        var searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                applyFilters();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', function() {
                applyFilters();
            });
        }

    }

    if (document.querySelector('.product-config')) {
        renderProductConfigPage();
    }
});


