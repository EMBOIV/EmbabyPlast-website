// Embaby Plast - Product showcase with folder-based Arabic/English structure

var PRODUCT_CATALOG = {
    '1': {
        id: '1', price: 2.50, category: 'styling',
        name: 'Classic Hair Styling Comb',
        nameAr: '\u0645\u0634\u0637 \u062A\u0635\u0641\u064A\u0641 \u0627\u0644\u0634\u0639\u0631 \u0627\u0644\u0643\u0644\u0627\u0633\u064A\u0643\u064A',
        description: 'A versatile hair styling comb made from premium polypropylene. Features fine and coarse teeth for all hair types. Ideal for salons, barbershops, and retail distribution.',
        descriptionAr: '\u0645\u0634\u0637 \u062A\u0635\u0641\u064A\u0641 \u0634\u0639\u0631 \u0645\u062A\u0639\u062F\u062F \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u062A \u0645\u0635\u0646\u0648\u0639 \u0645\u0646 \u0627\u0644\u0628\u0648\u0644\u064A \u0628\u0631\u0648\u0628\u064A\u0644\u064A\u0646 \u0627\u0644\u0645\u0645\u062A\u0627\u0632. \u064A\u062A\u0645\u064A\u0632 \u0628\u0623\u0633\u0646\u0627\u0646 \u062F\u0642\u064A\u0642\u0629 \u0648\u062E\u0634\u0646\u0629 \u0644\u062C\u0645\u064A\u0639 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0634\u0639\u0631.',
        material: 'PP (Polypropylene)', materialAr: '\u0628\u0648\u0644\u064A \u0628\u0631\u0648\u0628\u064A\u0644\u064A\u0646 (PP)',
        size: '20cm', sizeAr: '20 \u0633\u0645',
        moq: '500 pcs', moqAr: '500 \u0642\u0637\u0639\u0629'
    },
    '2': {
        id: '2', price: 1.20, category: 'styling',
        name: 'Pocket Comb',
        nameAr: '\u0645\u0634\u0637 \u0627\u0644\u062C\u064A\u0628',
        description: 'Compact and durable pocket comb designed for everyday carry. Smooth edges and precision-molded teeth prevent snagging.',
        descriptionAr: '\u0645\u0634\u0637 \u062C\u064A\u0628 \u0635\u063A\u064A\u0631 \u0648\u0645\u062A\u064A\u0646 \u0645\u0635\u0645\u0645 \u0644\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u064A\u0648\u0645\u064A. \u062D\u0648\u0627\u0641 \u0646\u0627\u0639\u0645\u0629 \u0648\u0623\u0633\u0646\u0627\u0646 \u0645\u0635\u0628\u0648\u0628\u0629 \u0628\u062F\u0642\u0629 \u062A\u0645\u0646\u0639 \u0627\u0644\u062A\u0634\u0627\u0628\u0643.',
        material: 'ABS Plastic', materialAr: '\u0628\u0644\u0627\u0633\u062A\u064A\u0643 ABS',
        size: '13cm', sizeAr: '13 \u0633\u0645',
        moq: '1000 pcs', moqAr: '1000 \u0642\u0637\u0639\u0629'
    },
    '3': {
        id: '3', price: 3.80, category: 'barber',
        name: 'Barber Professional Comb',
        nameAr: '\u0645\u0634\u0637 \u0627\u0644\u062D\u0644\u0627\u0642\u0629 \u0627\u0644\u0627\u062D\u062A\u0631\u0627\u0641\u064A',
        description: 'Heavy-duty professional barber comb with carbon fiber reinforced ABS construction. Heat resistant, anti-static.',
        descriptionAr: '\u0645\u0634\u0637 \u062D\u0644\u0627\u0642\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A \u0634\u062F\u064A\u062F \u0627\u0644\u062A\u062D\u0645\u0644 \u0628\u062A\u0635\u0645\u064A\u0645 ABS \u0645\u0639\u0632\u0632 \u0628\u0623\u0644\u064A\u0627\u0641 \u0627\u0644\u0643\u0631\u0628\u0648\u0646. \u0645\u0642\u0627\u0648\u0645 \u0644\u0644\u062D\u0631\u0627\u0631\u0629 \u0648\u0645\u0636\u0627\u062F \u0644\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0627\u0644\u0633\u0627\u0643\u0646\u0629.',
        material: 'Carbon Fiber + ABS', materialAr: '\u0623\u0644\u064A\u0627\u0641 \u0643\u0631\u0628\u0648\u0646 + ABS',
        size: '22cm', sizeAr: '22 \u0633\u0645',
        moq: '300 pcs', moqAr: '300 \u0642\u0637\u0639\u0629'
    },
    '4': {
        id: '4', price: 4.50, category: 'specialty',
        name: 'Anti-Static Comb',
        nameAr: '\u0645\u0634\u0637 \u0645\u0636\u0627\u062F \u0644\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0627\u0644\u0633\u0627\u0643\u0646\u0629',
        description: 'Advanced anti-static comb infused with carbon fiber technology. Eliminates static buildup and frizz.',
        descriptionAr: '\u0645\u0634\u0637 \u0645\u062A\u0642\u062F\u0645 \u0645\u0636\u0627\u062F \u0644\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0627\u0644\u0633\u0627\u0643\u0646\u0629 \u0628\u062A\u0642\u0646\u064A\u0629 \u0623\u0644\u064A\u0627\u0641 \u0627\u0644\u0643\u0631\u0628\u0648\u0646. \u064A\u0632\u064A\u0644 \u062A\u0631\u0627\u0643\u0645 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0648\u0627\u0644\u062A\u062C\u0639\u062F.',
        material: 'Carbon Fiber Infused', materialAr: '\u0645\u0634\u0628\u0639 \u0628\u0623\u0644\u064A\u0627\u0641 \u0627\u0644\u0643\u0631\u0628\u0648\u0646',
        size: '19cm', sizeAr: '19 \u0633\u0645',
        moq: '200 pcs', moqAr: '200 \u0642\u0637\u0639\u0629'
    },
    '5': {
        id: '5', price: 2.80, category: 'styling',
        name: 'Wide Tooth Detangling Comb',
        nameAr: '\u0645\u0634\u0637 \u0641\u0643 \u0627\u0644\u062A\u0634\u0627\u0628\u0643 \u0648\u0627\u0633\u0639 \u0627\u0644\u0623\u0633\u0646\u0627\u0646',
        description: 'Wide-spaced teeth designed for gentle detangling of wet and curly hair. Seamless construction prevents hair breakage.',
        descriptionAr: '\u0623\u0633\u0646\u0627\u0646 \u0645\u062A\u0628\u0627\u0639\u062F\u0629 \u0645\u0635\u0645\u0645\u0629 \u0644\u0641\u0643 \u0627\u0644\u062A\u0634\u0627\u0628\u0643 \u0628\u0644\u0637\u0641 \u0644\u0644\u0634\u0639\u0631 \u0627\u0644\u0645\u0628\u0644\u0644 \u0648\u0627\u0644\u0645\u062C\u0639\u062F.',
        material: 'PP (Polypropylene)', materialAr: '\u0628\u0648\u0644\u064A \u0628\u0631\u0648\u0628\u064A\u0644\u064A\u0646 (PP)',
        size: '21cm', sizeAr: '21 \u0633\u0645',
        moq: '500 pcs', moqAr: '500 \u0642\u0637\u0639\u0629'
    },
    '6': {
        id: '6', price: 2.20, category: 'barber',
        name: 'Tail Comb',
        nameAr: '\u0645\u0634\u0637 \u0627\u0644\u0630\u064A\u0644',
        description: 'Precision tail comb with pointed end for sectioning, parting, and detailed styling work.',
        descriptionAr: '\u0645\u0634\u0637 \u0630\u064A\u0644 \u062F\u0642\u064A\u0642 \u0628\u0637\u0631\u0641 \u0645\u062F\u0628\u0628 \u0644\u0644\u062A\u0642\u0633\u064A\u0645 \u0648\u0627\u0644\u0641\u0631\u0642 \u0648\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062A\u0635\u0641\u064A\u0641 \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A\u0629.',
        material: 'Nylon', materialAr: '\u0646\u0627\u064A\u0644\u0648\u0646',
        size: '23cm', sizeAr: '23 \u0633\u0645',
        moq: '500 pcs', moqAr: '500 \u0642\u0637\u0639\u0629'
    },
    '7': {
        id: '7', price: 0.00, category: 'specialty',
        name: 'Custom Molded Comb',
        nameAr: '\u0645\u0634\u0637 \u0645\u0635\u0628\u0648\u0628 \u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628',
        description: 'Fully customizable comb manufactured to your exact specifications. Choose material, dimensions, tooth spacing, colors, and branding. OEM and private label available.',
        descriptionAr: '\u0645\u0634\u0637 \u0642\u0627\u0628\u0644 \u0644\u0644\u062A\u062E\u0635\u064A\u0635 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u064A\u0635\u0646\u0639 \u0648\u0641\u0642 \u0645\u0648\u0627\u0635\u0641\u0627\u062A\u0643 \u0627\u0644\u062F\u0642\u064A\u0642\u0629. \u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0627\u062F\u0629 \u0648\u0627\u0644\u0623\u0628\u0639\u0627\u062F \u0648\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u0623\u0633\u0646\u0627\u0646 \u0648\u0627\u0644\u0623\u0644\u0648\u0627\u0646. OEM \u0648\u0627\u0644\u0639\u0644\u0627\u0645\u0629 \u0627\u0644\u062E\u0627\u0635\u0629 \u0645\u062A\u0627\u062D\u0629.',
        material: 'PP / ABS / Nylon', materialAr: '\u0628\u0648\u0644\u064A \u0628\u0631\u0648\u0628\u064A\u0644\u064A\u0646 / ABS / \u0646\u0627\u064A\u0644\u0648\u0646',
        size: 'Custom', sizeAr: '\u062D\u0633\u0628 \u0627\u0644\u0637\u0644\u0628',
        moq: '1000 pcs', moqAr: '1000 \u0642\u0637\u0639\u0629'
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

var CATEGORY_LABELS = {
    en: { styling: 'Styling', barber: 'Barber', specialty: 'Specialty' },
    ar: { styling: '\u062A\u0635\u0641\u064A\u0641', barber: '\u062D\u0644\u0627\u0642\u0629', specialty: '\u0645\u062A\u062E\u0635\u0635' }
};

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

    var productName = ar ? product.nameAr : product.name;
    if (pageTitle) pageTitle.textContent = productName;
    document.title = productName + (ar ? ' - \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A' : ' - Embaby Plast');

    var productImg = imgBase + product.id + '.jpg';

    var pricingMarkup = '';
    if (product.price > 0) {
        pricingMarkup = '<div class="product-config-pricing"><p class="product-config-price">EGP ' + product.price.toFixed(2) + '</p></div>';
    } else {
        var priceLabel = ar ? '\u0627\u0644\u0633\u0639\u0631 \u0639\u0646\u062F \u0627\u0644\u0637\u0644\u0628' : 'Price on Request';
        pricingMarkup = '<div class="product-config-pricing"><p class="product-config-price">' + priceLabel + '</p></div>';
    }

    var langKey = ar ? 'ar' : 'en';
    var catLabel = CATEGORY_LABELS[langKey][product.category] || product.category;

    var lblMaterial = ar ? '\u0627\u0644\u0645\u0627\u062F\u0629' : 'Material';
    var lblSize = ar ? '\u0627\u0644\u0645\u0642\u0627\u0633' : 'Size';
    var lblMoq = ar ? '\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0637\u0644\u0628' : 'Min. Order Qty';
    var lblCategory = ar ? '\u0627\u0644\u0641\u0626\u0629' : 'Category';

    var specsMarkup = '<div class="product-config-specs"><table>'
        + '<tr><td>' + lblMaterial + '</td><td>' + (ar ? product.materialAr : product.material) + '</td></tr>'
        + '<tr><td>' + lblSize + '</td><td>' + (ar ? product.sizeAr : product.size) + '</td></tr>'
        + '<tr><td>' + lblMoq + '</td><td>' + (ar ? product.moqAr : product.moq) + '</td></tr>'
        + '<tr><td>' + lblCategory + '</td><td>' + catLabel + '</td></tr>'
        + '</table></div>';

    var whatsappMsg = ar
        ? '\u0645\u0631\u062D\u0628\u0627\u064B \u0625\u0645\u0628\u0627\u0628\u064A \u0628\u0644\u0627\u0633\u062A! \u0623\u0648\u062F \u0627\u0644\u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u0639\u0646: ' + productName
        : 'Hello Embaby Plast! I would like to inquire about: ' + product.name;
    var whatsappLink = 'https://wa.me/201010294098?text=' + encodeURIComponent(whatsappMsg);

    var btnWhatsapp = ar ? '\u062A\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628' : 'Contact via WhatsApp';
    var btnBack = ar ? '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0643\u062A\u0627\u0644\u0648\u062C' : 'Back to Catalog';

    container.innerHTML = ''
        + '<div class="product-config-card">'
        + '<div class="product-config-media">'
        + '<img id="product-main-image" src="' + productImg + '" alt="' + productName + '">'
        + '</div>'
        + '<div class="product-config-form">'
        + '<p class="product-config-description">' + (ar ? product.descriptionAr : product.description) + '</p>'
        + specsMarkup
        + pricingMarkup
        + '<div class="product-config-actions">'
        + '<a href="' + whatsappLink + '" target="_blank" rel="noopener noreferrer" class="btn whatsapp-btn"><i class="fab fa-whatsapp"></i> ' + btnWhatsapp + '</a>'
        + '<a href="products.html" class="btn btn-outline-dark">' + btnBack + '</a>'
        + '</div>'
        + '</div>'
        + '</div>';

    // Update language toggle links to pass product ID
    var langToggle = document.getElementById('lang-toggle-link');
    var langMobile = document.getElementById('lang-switch-mobile');
    var otherLangFolder = ar ? '../en/' : '../ar/';
    var otherProductUrl = otherLangFolder + 'product.html?id=' + productId;
    if (langToggle) langToggle.href = otherProductUrl;
    if (langMobile) langMobile.href = otherProductUrl;
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
        var params = new URLSearchParams(window.location.search);
        var category = params.get('category');
        var filterLinks = productsSection.querySelectorAll('.products-filter-link');
        var categoryMap = { styling: 'Hair Styling', barber: 'Barber Professional', specialty: 'Specialty' };
        var activeCategory = category && categoryMap[category] ? category : 'all';
        var allBoxes = productsSection.querySelectorAll('.box-container .box');

        function applyFilters() {
            var searchInput = document.getElementById('product-search');
            var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var noResults = document.getElementById('no-results');
            var visibleCount = 0;

            allBoxes.forEach(function(box) {
                var matchesCategory = activeCategory === 'all' || box.dataset.category === activeCategory;
                var matchesSearch = true;

                if (query) {
                    var productId = box.dataset.id;
                    var product = PRODUCT_CATALOG[productId];
                    if (product) {
                        var searchableText = [
                            product.name, product.nameAr,
                            product.description, product.descriptionAr,
                            product.material, product.materialAr,
                            product.size, product.sizeAr,
                            product.category
                        ].join(' ').toLowerCase();
                        matchesSearch = searchableText.indexOf(query) !== -1;
                    } else {
                        var boxText = box.textContent.toLowerCase();
                        matchesSearch = boxText.indexOf(query) !== -1;
                    }
                }

                var visible = matchesCategory && matchesSearch;
                box.style.display = visible ? '' : 'none';
                if (visible) visibleCount++;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? '' : 'none';
            }
        }

        allBoxes.forEach(function(box) {
            box.style.display = activeCategory === 'all' || box.dataset.category === activeCategory ? '' : 'none';
        });

        filterLinks.forEach(function(link) {
            var linkCategory = link.dataset.category || 'all';
            link.classList.toggle('active', linkCategory === activeCategory);
        });

        // Search input listener
        var searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                applyFilters();
            });
        }

        if (category && !categoryMap[category]) {
            window.history.replaceState({}, '', 'products.html');
        }
    }

    if (document.querySelector('.product-config')) {
        renderProductConfigPage();
    }

    document.querySelectorAll('.products.luxury-grid .box[data-detail-url]').forEach(function(box) {
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
});
