// Embaby Plast - Product showcase with folder-based Arabic/English structure
// ===== PRODUCT CATALOG =====
// Each row = one variant. Families are grouped using familyKey.
// Required fields for import:
// id, familyKey, familyName, familyNameAr, variantName, variantNameAr,
// name, nameAr, DozenPrice, pcsPerCarton, imageFile, badge, enabled

var PRODUCT_CATALOG = {
    '1': {
        id: '1',
        familyKey: 'Amira',
        familyName: 'Amira Combs',
        familyNameAr: 'أمشاط أميرة',
        variantName: 'Colors',
        variantNameAr: 'ألوان',
        name: 'Amira Colors Comb',
        nameAr: 'مشط أميرة ألوان',
        cartonPrice: 50,
        pcsPerCarton: '144',
        pcsPerCartonAr: '144',
        description: 'Amira comb - regular colors variant.',
        descriptionAr: 'مشط أميرة - إصدار الألوان العادية.',
        imageFile: 'Amira.jpg',
        badge: 'most selling',
        enabled: '1'
    },
    '2': {
        id: '2',
        familyKey: 'Dolphin',
        familyName: 'Dolphin Combs',
        familyNameAr: 'أمشاط دولفين',
        variantName: 'Two Tone',
        variantNameAr: '٢ لون',
        name: 'Dolphin Two Tone Comb',
        nameAr: 'مشط دولفين ٢ لون',
        cartonPrice: 75,
        pcsPerCarton: '144',
        pcsPerCartonAr: '144',
        description: 'Dolphin comb - two tone variant.',
        descriptionAr: 'مشط دولفين - إصدار لونين.',
        imageFile: 'Dolphin2color.jpg',
        badge: '',
        enabled: '1'
    },
    '3': {
        id: '3',
        familyKey: 'Dolphin',
        familyName: 'Dolphin Combs',
        familyNameAr: 'أمشاط دولفين',
        variantName: 'Colors',
        variantNameAr: 'ألوان',
        name: 'Dolphin Colors Comb',
        nameAr: 'مشط دولفين ألوان',
        cartonPrice: 55,
        pcsPerCarton: '144',
        pcsPerCartonAr: '144',
        description: 'Dolphin comb - regular colors variant.',
        descriptionAr: 'مشط دولفين - إصدار الألوان العادية.',
        imageFile: 'Dolphin.jpg',
        badge: '',
        enabled: '1'
    },
    '4': {
        id: '4',
        familyKey: 'Carmen',
        familyName: 'Carmen Combs',
        familyNameAr: 'أمشاط كارمن',
        variantName: 'Fluorescent',
        variantNameAr: 'فسفوري',
        name: 'Carmen Fluorescent Comb',
        nameAr: 'مشط كارمن فسفوري',
        cartonPrice: 72,
        pcsPerCarton: '144',
        pcsPerCartonAr: '144',
        description: 'Carmen comb - fluorescent variant.',
        descriptionAr: 'مشط كارمن - إصدار فسفوري.',
        imageFile: 'Carmen.jpg',
        badge: 'popular',
        enabled: '1'
    }
};

// Detect language from <html lang> attribute
function isArabic() {
    return document.documentElement.getAttribute('lang') === 'ar';
}

// Get image base path relative to current page (pages are in /en/ or /ar/ subfolders)
function getImageBase() {
    return '../images/';
}

function toNumberPrice(value) {
    var num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function getNumericPrice(product) {
    return toNumberPrice(product.DozenPrice || product.dozenPrice || product.cartonPrice);
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
        var varAr = product.variantNameAr || product.variantName || '';
        return (famAr + (varAr ? ' - ' + varAr : '')).trim();
    }
    if (product.name) return product.name;
    var fam = product.familyName || product.familyNameAr || '';
    var variant = product.variantName || product.variantNameAr || '';
    return (fam + (variant ? ' - ' + variant : '')).trim();
}

function getVariantLabel(product, ar) {
    if (ar) return product.variantNameAr || product.variantName || product.finishAr || product.finish || product.id;
    return product.variantName || product.variantNameAr || product.finish || product.finishAr || product.id;
}

function getProductImageFile(product) {
    return product.imageFile || (String(product.id) + '.jpg');
}

function isProductEnabled(product) {
    var raw = String(product.enabled == null ? '1' : product.enabled).trim().toLowerCase();
    return !(raw === '0' || raw === 'false' || raw === 'no' || raw === 'off' || raw === 'disabled');
}

function normalizeBadge(value) {
    return String(value || '').trim().toLowerCase();
}

function getBadgeClass(value) {
    var badge = normalizeBadge(value);
    if (!badge) return '';
    if (badge.indexOf('hot') !== -1) return '';
    if (badge.indexOf('most') !== -1 || badge.indexOf('sell') !== -1 || badge.indexOf('best') !== -1) return 'bestseller';
    if (badge.indexOf('popular') !== -1) return 'popular';
    return 'new';
}

function getBadgeLabel(value, ar) {
    var badge = normalizeBadge(value);
    if (!badge) return '';
    if (badge.indexOf('hot') !== -1) return '';
    if (ar) {
        if (badge.indexOf('most') !== -1 || badge.indexOf('sell') !== -1 || badge.indexOf('best') !== -1) return 'الأكثر مبيعاً';
        if (badge.indexOf('popular') !== -1) return 'شائع';
        return 'جديد';
    }
    if (badge.indexOf('most') !== -1 || badge.indexOf('sell') !== -1 || badge.indexOf('best') !== -1) return 'Most Selling';
    if (badge.indexOf('popular') !== -1) return 'Popular';
    return 'New';
}

function getCatalogArray() {
    return Object.keys(PRODUCT_CATALOG).map(function(id) {
        return PRODUCT_CATALOG[id];
    }).filter(function(product) {
        return isProductEnabled(product);
    });
}

function buildFamilies(products) {
    var map = {};

    products.forEach(function(product) {
        var key = String(product.familyKey || product.id);
        if (!map[key]) {
            map[key] = {
                key: key,
                familyName: product.familyName || product.name || '',
                familyNameAr: product.familyNameAr || product.nameAr || product.familyName || product.name || '',
                variants: []
            };
        }
        map[key].variants.push(product);
    });

    return Object.keys(map).map(function(key) {
        var family = map[key];
        var minPrice = 0;

        family.variants.forEach(function(variant) {
            var price = getNumericPrice(variant);
            if (price > 0 && (minPrice === 0 || price < minPrice)) {
                minPrice = price;
            }
        });

        family.minPrice = minPrice;
        family.badge = '';
        for (var i = 0; i < family.variants.length; i++) {
            if (normalizeBadge(family.variants[i].badge)) {
                family.badge = family.variants[i].badge;
                break;
            }
        }

        family.searchText = family.variants.map(function(variant) {
            return [
                variant.familyName, variant.familyNameAr,
                variant.variantName, variant.variantNameAr,
                variant.name, variant.nameAr
            ].join(' ');
        }).join(' ').toLowerCase();

        return family;
    });
}

function getPriceText(product, ar) {
    var price = getNumericPrice(product);
    if (price > 0) {
        return 'EGP ' + price.toFixed(2);
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
}

function getDozensPerCarton(product) {
    var pcsRaw = product.pcsPerCarton != null ? product.pcsPerCarton : product.pcsPerCartonAr;
    var pcs = Number(pcsRaw);
    if (!Number.isFinite(pcs) || pcs <= 0) return '';
    var dozens = pcs / 12;
    if (Number.isInteger(dozens)) return String(dozens);
    return dozens.toFixed(2).replace(/\.00$/, '');
}

function getStartsFromText(minPrice, ar) {
    if (minPrice > 0) {
        return 'EGP ' + minPrice.toFixed(2);
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
}

function getCheapestVariant(variants) {
    var cheapest = null;
    var cheapestPrice = 0;

    for (var i = 0; i < variants.length; i++) {
        var variant = variants[i];
        var price = getNumericPrice(variant);
        if (price > 0 && (cheapest === null || price < cheapestPrice)) {
            cheapest = variant;
            cheapestPrice = price;
        }
    }

    return cheapest || variants[0] || null;
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

function getFamilyVariants(product) {
    var familyKey = String(product.familyKey || product.id);
    return getCatalogArray().filter(function(item) {
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
        var familyTitle = ar ? family.familyNameAr : family.familyName;
        var startsFrom = getStartsFromText(family.minPrice, ar);
        return ''
            + '<article class="recommendation-card" data-detail-url="product.html?id=' + escapeHtml(topVariant.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(familyTitle) + '">'
            + '<div class="recommendation-image-wrap"><img src="' + imgBase + escapeHtml(getProductImageFile(topVariant)) + '" alt="' + escapeHtml(getProductName(topVariant, ar)) + '"></div>'
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

    var familyName = ar
        ? (product.familyNameAr || product.nameAr || product.familyName || product.name)
        : (product.familyName || product.name || product.familyNameAr || product.nameAr);
    if (pageTitle) pageTitle.textContent = familyName;
    document.title = familyName + (ar ? ' - \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A' : ' - Embaby Plast');

    var variants = getFamilyVariants(product).slice().sort(function(a, b) {
        var pa = getNumericPrice(a);
        var pb = getNumericPrice(b);

        // Keep "on request" (0) variants at the end, then sort ascending by price.
        if (pa === 0 && pb > 0) return 1;
        if (pb === 0 && pa > 0) return -1;
        return pa - pb;
    });
    var lblVariant = ar ? '\u0627\u0644\u0623\u0646\u0648\u0627\u0639' : 'Variants';
    var priceLabel = ar ? '\u0633\u0639\u0631 \u0627\u0644\u062F\u0633\u062A\u0629' : 'Dozen Price';
    var dozenInCartonLabel = ar ? '\u0639\u062F\u062F \u0627\u0644\u062F\u0633\u062A\u0629 \u0641\u064A \u0627\u0644\u0643\u0631\u062A\u0648\u0646\u0629' : 'Dozens Per Carton';
    var btnWhatsapp = ar ? '\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628' : 'Contact via WhatsApp';
    var btnBack = ar ? '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0643\u062A\u0627\u0644\u0648\u062C' : 'Back to Catalog';

    var langToggle = document.getElementById('lang-toggle-link');
    var langMobile = document.getElementById('lang-switch-mobile');
    var otherLangFolder = ar ? '../en/' : '../ar/';
    var otherProductUrl = otherLangFolder + 'product.html?id=' + product.id;
    if (langToggle) langToggle.href = otherProductUrl;
    if (langMobile) langMobile.href = otherProductUrl;

    var cardsMarkup = variants.map(function(item) {
        var productName = getProductName(item, ar);
        var priceText = getPriceText(item, ar);
        var dozensPerCarton = getDozensPerCarton(item);
        var cardWhatsappMsg = ar
            ? '\u0645\u0631\u062D\u0628\u0627\u064B \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A! \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646: ' + productName
            : 'Hello Embaby Plast! I would like to inquire about: ' + productName;

        return ''
            + '<article class="product-variant-card' + (String(item.id) === String(product.id) ? ' active' : '') + '" data-detail-url="product.html?id=' + escapeHtml(item.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(productName) + '">'
            + '<div class="images">'
            + '<img src="' + imgBase + escapeHtml(getProductImageFile(item)) + '" alt="' + escapeHtml(productName) + '" onerror="this.style.background=\'#D8DEE4\';this.style.height=\'28rem\'">'
            + '</div>'
            + '<div class="content">'
                + '<h3>' + escapeHtml(productName) + '</h3>'
            + '<p class="product-price product-variant-price"><span class="price-label">' + priceLabel + ':</span><span class="product-variant-price-value">' + escapeHtml(priceText) + '</span></p>'
            + '<p class="product-dozen-qty"><span class="qty-label">' + dozenInCartonLabel + ':</span><span class="qty-value"> ' + escapeHtml(dozensPerCarton || '-') + '</span></p>'
            + '</div>'
            + '<div class="icons">'
            + '<a href="https://wa.me/201010294098?text=' + encodeURIComponent(cardWhatsappMsg) + '" target="_blank" rel="noopener noreferrer" class="btn-cart product-variant-wa">' + btnWhatsapp + '</a>'
            + '</div>'
            + '</article>';
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

    container.querySelectorAll('.product-variant-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.product-view-link') || e.target.closest('.product-variant-wa')) return;
            window.location.href = this.dataset.detailUrl;
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = this.dataset.detailUrl;
            }
        });
    });

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

document.addEventListener('DOMContentLoaded', function() {
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
        var products = getCatalogArray();
        var families = buildFamilies(products);

        // Generate family cards dynamically from PRODUCT_CATALOG
        var cardsHtml = '';
        for (var i = 0; i < families.length; i++) {
            var family = families[i];
            var initial = getHighestPriceVariant(family.variants);
            var familyTitle = ar ? family.familyNameAr : family.familyName;
            var startsFrom = getStartsFromText(family.minPrice, ar);
            var viewLabel = ar ? '\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644' : 'View Details';
            var badgeLabel = getBadgeLabel(family.badge, ar);
            var badgeClass = getBadgeClass(family.badge);

            cardsHtml += ''
                + '<div class="box" data-family-key="' + escapeHtml(family.key) + '" data-search="' + escapeHtml(family.searchText) + '" data-detail-url="product.html?id=' + escapeHtml(initial.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(familyTitle) + '">'
                + (badgeLabel ? '<span class="product-badge ' + escapeHtml(badgeClass) + '">' + escapeHtml(badgeLabel) + '</span>' : '')
                + '<div class="images">'
                + '<img class="product-family-image" src="' + imgBase + escapeHtml(getProductImageFile(initial)) + '" alt="' + escapeHtml(getProductName(initial, ar)) + '" onerror="this.style.background=\'#D8DEE4\';this.style.height=\'28rem\'">'
                + '</div>'
                + '<div class="content">'
                + '<h3>' + escapeHtml(familyTitle) + '</h3>'
                + '<div class="product-price product-variant-price"><span class="price-label">' + (ar ? '\u0627\u0644\u0633\u0639\u0631 \u064A\u0628\u062F\u0623 \u0645\u0646:' : 'Price starts from:') + '</span><span class="product-variant-price-value">' + escapeHtml(startsFrom) + '</span></div>'
                + '</div>'
                + '<div class="icons">'
                + '<a href="product.html?id=' + escapeHtml(initial.id) + '" class="btn-cart product-view-link">' + viewLabel + '</a>'
                + '</div>'
                + '</div>';
        }
        if (boxContainer) boxContainer.innerHTML = cardsHtml;

        // Get generated family cards
        var allBoxes = productsSection.querySelectorAll('.box-container .box');

        function applyFilters() {
            var searchInput = document.getElementById('product-search');
            var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var noResults = document.getElementById('no-results');
            var visibleCount = 0;

            allBoxes.forEach(function(box) {
                var searchableText = box.dataset.search || box.textContent.toLowerCase();
                var matchesSearch = !query || searchableText.indexOf(query) !== -1;

                var visible = matchesSearch;
                box.style.display = visible ? '' : 'none';
                if (visible) visibleCount++;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? '' : 'none';
            }

            if (totalCountEl) {
                var totalText = ar
                    ? ('إجمالي المنتجات: ' + families.length)
                    : ('Total products: ' + families.length);
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

        // Click/keyboard handlers for product cards
        allBoxes.forEach(function(box) {
            box.addEventListener('click', function(e) {
                if (e.target.closest('.product-view-link')) return;
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

    if (document.querySelector('.product-config')) {
        renderProductConfigPage();
    }
});


