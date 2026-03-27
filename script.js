// Embaby Plast - Product showcase with folder-based Arabic/English structure
// ===== PRODUCT CATALOG =====
// Each row = one variant. Families are grouped using familyKey.
// Required fields for import:
// id, familyKey, familyName, familyNameAr, variantName, variantNameAr,
// cartonPrice, pcsPerCarton, description, descriptionAr, imageFile

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
        imageFile: 'Amira.jpg'
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
        imageFile: 'Dolphin2color.jpg'
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
        imageFile: 'Dolphin.jpg'
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
        imageFile: 'Carmen.jpg'
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

function getCatalogArray() {
    return Object.keys(PRODUCT_CATALOG).map(function(id) {
        return PRODUCT_CATALOG[id];
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
            var price = toNumberPrice(variant.cartonPrice);
            if (price > 0 && (minPrice === 0 || price < minPrice)) {
                minPrice = price;
            }
        });

        family.minPrice = minPrice;

        family.searchText = family.variants.map(function(variant) {
            return [
                variant.familyName, variant.familyNameAr,
                variant.variantName, variant.variantNameAr,
                variant.name, variant.nameAr,
                variant.description, variant.descriptionAr
            ].join(' ');
        }).join(' ').toLowerCase();

        return family;
    });
}

function getPriceText(product, ar) {
    var price = toNumberPrice(product.cartonPrice);
    if (price > 0) {
        return 'EGP ' + price.toFixed(2);
    }
    return ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'On Request';
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
        var price = toNumberPrice(variant.cartonPrice);
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
        var price = toNumberPrice(variant.cartonPrice);
        if (price > highestPrice) {
            highest = variant;
            highestPrice = price;
        }
    }

    return highest || variants[0] || null;
}

function updateFamilyCard(card, product, ar, imgBase) {
    var img = card.querySelector('.product-family-image');
    var variantPrice = card.querySelector('.product-variant-price-value');
    var variantName = card.querySelector('.product-current-variant');
    var finish = card.querySelector('.product-current-finish');
    var link = card.querySelector('.product-view-link');

    var productName = getProductName(product, ar);
    if (img) {
        img.src = imgBase + getProductImageFile(product);
        img.alt = productName;
    }
    if (variantPrice) variantPrice.textContent = getPriceText(product, ar);
    if (variantName) variantName.textContent = getVariantLabel(product, ar);
    if (finish) finish.textContent = ar
        ? ('\u0627\u0644\u0646\u0648\u0639: ' + getVariantLabel(product, true))
        : ('Type: ' + getVariantLabel(product, false));
    if (link) link.href = 'product.html?id=' + product.id;
}

function getFamilyVariants(product) {
    var familyKey = String(product.familyKey || product.id);
    return getCatalogArray().filter(function(item) {
        return String(item.familyKey || item.id) === familyKey;
    });
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

    if (!product) {
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
        var pa = toNumberPrice(a.cartonPrice);
        var pb = toNumberPrice(b.cartonPrice);

        // Keep "on request" (0) variants at the end, then sort ascending by price.
        if (pa === 0 && pb > 0) return 1;
        if (pb === 0 && pa > 0) return -1;
        return pa - pb;
    });
    var initialVariant = getCheapestVariant(variants);
    var lblVariantType = ar ? '\u0627\u0644\u0646\u0648\u0639' : 'Type';
    var lblPcsPerCarton = ar ? '\u0639\u062F\u062F \u0627\u0644\u0642\u0637\u0639 / \u0643\u0631\u062A\u0648\u0646\u0629' : 'Pcs / Carton';
    var lblVariant = ar ? '\u0627\u0644\u0623\u0646\u0648\u0627\u0639' : 'Variants';
    var priceLabel = ar ? '\u0633\u0639\u0631 \u0627\u0644\u0643\u0631\u062A\u0648\u0646\u0629' : 'Carton Price';
    var btnWhatsapp = ar ? '\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628' : 'Contact via WhatsApp';
    var btnBack = ar ? '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0643\u062A\u0627\u0644\u0648\u062C' : 'Back to Catalog';

    var optionsMarkup = variants.map(function(item) {
        return '<button type="button" class="variant-option-btn" data-variant-id="' + escapeHtml(item.id) + '">' + escapeHtml(getVariantLabel(item, ar)) + '</button>';
    }).join('');

    container.innerHTML = ''
        + '<div class="product-config-card">'
        + '<div class="product-config-media">'
        + '<img id="product-main-image" src="" alt="">'
        + '</div>'
        + '<div class="product-config-form">'
        + '<p class="product-config-description" id="product-description"></p>'
        + '<div class="product-variant-options">'
        + '<p class="variant-options-label">' + lblVariant + '</p>'
        + '<div class="variant-options-row">' + optionsMarkup + '</div>'
        + '</div>'
        + '<div class="product-config-specs"><table>'
        + '<tr><td>' + lblVariantType + '</td><td id="product-finish-value"></td></tr>'
        + '<tr><td>' + lblPcsPerCarton + '</td><td id="product-pcs-value"></td></tr>'
        + '</table></div>'
        + '<div class="product-config-pricing"><p class="product-config-price-label">' + priceLabel + '</p><p class="product-config-price" id="product-price-value"></p></div>'
        + '<div class="product-config-actions">'
        + '<a href="#" target="_blank" rel="noopener noreferrer" class="btn whatsapp-btn" id="product-whatsapp-link"><i class="fab fa-whatsapp"></i> ' + btnWhatsapp + '</a>'
        + '<a href="products.html" class="btn btn-outline-dark">' + btnBack + '</a>'
        + '</div>'
        + '</div>'
        + '</div>';

    function applyVariant(selectedProduct) {
        var productName = getProductName(selectedProduct, ar);
        var mainImg = document.getElementById('product-main-image');
        var descEl = document.getElementById('product-description');
        var finishEl = document.getElementById('product-finish-value');
        var pcsEl = document.getElementById('product-pcs-value');
        var priceEl = document.getElementById('product-price-value');
        var whatsappEl = document.getElementById('product-whatsapp-link');

        if (mainImg) {
            mainImg.src = imgBase + getProductImageFile(selectedProduct);
            mainImg.alt = productName;
            mainImg.classList.add('clickable-preview');
        }
        if (descEl) descEl.textContent = ar ? (selectedProduct.descriptionAr || selectedProduct.description || '') : (selectedProduct.description || selectedProduct.descriptionAr || '');
        if (finishEl) finishEl.textContent = getVariantLabel(selectedProduct, ar);
        if (pcsEl) pcsEl.textContent = ar ? (selectedProduct.pcsPerCartonAr || selectedProduct.pcsPerCarton || '') : (selectedProduct.pcsPerCarton || selectedProduct.pcsPerCartonAr || '');
        if (priceEl) priceEl.textContent = getPriceText(selectedProduct, ar);

        var whatsappMsg = ar
            ? '\u0645\u0631\u062D\u0628\u0627\u064B \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A! \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646: ' + productName
            : 'Hello Embaby Plast! I would like to inquire about: ' + productName;
        if (whatsappEl) whatsappEl.href = 'https://wa.me/201010294098?text=' + encodeURIComponent(whatsappMsg);

        var langToggle = document.getElementById('lang-toggle-link');
        var langMobile = document.getElementById('lang-switch-mobile');
        var otherLangFolder = ar ? '../en/' : '../ar/';
        var otherProductUrl = otherLangFolder + 'product.html?id=' + selectedProduct.id;
        if (langToggle) langToggle.href = otherProductUrl;
        if (langMobile) langMobile.href = otherProductUrl;

        container.querySelectorAll('.variant-option-btn').forEach(function(btn) {
            btn.classList.toggle('active', String(btn.dataset.variantId) === String(selectedProduct.id));
        });
    }

    container.querySelectorAll('.variant-option-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var selected = PRODUCT_CATALOG[this.dataset.variantId];
            if (!selected) return;
            applyVariant(selected);
        });
    });

    var lightbox = ensureProductImageLightbox();
    var lightboxImg = document.getElementById('product-image-lightbox-img');
    var mainImage = document.getElementById('product-main-image');
    if (mainImage && lightbox && lightboxImg) {
        mainImage.addEventListener('click', function() {
            lightboxImg.src = mainImage.src;
            lightboxImg.alt = mainImage.alt;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    applyVariant(initialVariant || product);

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

            cardsHtml += ''
                + '<div class="box" data-family-key="' + escapeHtml(family.key) + '" data-search="' + escapeHtml(family.searchText) + '" data-detail-url="product.html?id=' + escapeHtml(initial.id) + '" tabindex="0" role="link" aria-label="' + escapeHtml(familyTitle) + '">'
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


