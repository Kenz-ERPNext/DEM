frappe.pages['company-branch-tree'].on_page_load = function (wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Company & Branches',
        single_column: true
    });

    var container = $('<div class="company-branch-tree"></div>');
    $(wrapper).append(container);

    // ------------------ FETCH COMPANIES ------------------
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'DEM Company',
            fields: ['name']
        },
        callback: function (res) {
            (res.message || []).forEach(function (c) {

                var companyBlock = $(`
                    <div class="company">
                        <div class="company-name">
                            ${c.name}
                            <span class="count-badge company-count">0</span>
                        </div>
                        <ul class="branch-list"></ul>
                    </div>
                `);

                var branchList = companyBlock.find('.branch-list');

                // ------------------ FETCH BRANCHES ------------------
                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'DEM Branch',
                        filters: { dem_company: c.name },
                        fields: ['name']
                    },
                    callback: function (branches) {
                        companyBlock.find('.company-count').text(branches.message.length);

                        (branches.message || []).forEach(function (b) {

                            var branchItem = $(`
                                <li class="branch-item">
                                    <div class="branch-name">
                                        ${b.name}
                                        <span class="count-badge branch-count">0</span>
                                    </div>
                                    <ul class="module-list"></ul>
                                </li>
                            `);

                            var moduleList = branchItem.find('.module-list');
                            var totalDocs = 0;

                            totalDocs += addModule(moduleList, 'Employee', 'DEM Employee', c.name, b.name, 'employee');
                            totalDocs += addModule(moduleList, 'Vehicle', 'DEM Vehicle', c.name, b.name, 'vehicle');
                            totalDocs += addModule(moduleList, 'Official Docs', 'DEM Official Documents', c.name, b.name, 'document');

                            // update branch count later
                            setTimeout(() => {
                                branchItem.find('.branch-count').text(
                                    branchItem.find('.document-item').length
                                );
                            }, 500);

                            branchItem.find('.branch-name').on('click', function () {
                                moduleList.slideToggle();
                                $(this).toggleClass('expanded');
                            });

                            branchList.append(branchItem);
                        });
                    }
                });

                companyBlock.find('.company-name').on('click', function () {
                    branchList.slideToggle();
                    $(this).toggleClass('expanded');
                });

                container.append(companyBlock);
            });
        }
    });

    // ------------------ MODULE FUNCTION ------------------
    function addModule(parent, title, doctype, company, branch, cls) {
        var module = $(`
            <li class="module ${cls}">
                <div class="module-title">
                    ${title}
                    <span class="count-badge module-count">0</span>
                </div>
                <ul class="document-list"></ul>
            </li>
        `);

        var docList = module.find('.document-list');

        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: doctype,
                filters: { dem_company: company, dem_branch: branch },
                fields: ['name']
            },
            callback: function (res) {
                (res.message || []).forEach(function (d) {
                    docList.append(`<li class="document-item">${d.name}</li>`);
                });
                module.find('.module-count').text(res.message.length);
            }
        });

        module.find('.module-title').on('click', function () {
            docList.slideToggle();
            $(this).toggleClass('expanded');
        });

        parent.append(module);
        return 0;
    }

    // ------------------ STYLES ------------------
    $('<style>').prop('type', 'text/css').html(`
    /* ---------- BASE ---------- */
    .company-branch-tree {
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        color: #e5e7eb;
    }

    /* ---------- COMPANY ---------- */
    .company {
        background: linear-gradient(135deg, #1f2937, #111827);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 18px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.35);
        font-size: 16px;
    }

    .company-name {
        font-size: 17px;
        color: #ffffff;
    }

    /* ---------- BRANCH ---------- */
    .branch-item {
        background: #1e293b;
        margin: 10px 0;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid #334155;
    }

    .branch-name {
        font-size: 15px;
        color: #f8fafc;
    }

    /* ---------- MODULE ---------- */
    .module {
        padding: 8px 10px;
        border-radius: 8px;
        margin: 8px 0;
        border-left: 4px solid;
    }

    .module-title {
        font-size: 14px;
        color: #ffffff;
    }

    /* Module Accent Colors (Dark & Professional) */
    .module.employee {
        background: #0f172a;
        border-color: #38bdf8;
    }

    .module.vehicle {
        background: #020617;
        border-color: #22c55e;
    }

    .module.document {
        background: #020617;
        border-color: #f59e0b;
    }

    /* ---------- LISTS ---------- */
    .branch-list,
    .module-list,
    .document-list {
        list-style: none;
        margin-left: 18px;
        display: none;
        padding-left: 0;
    }

    .document-item {
        font-size: 13px;
        padding: 4px 0;
        color: #cbd5f5;
    }

    .document-item:hover {
        color: #ffffff;
    }

    /* ---------- BADGES ---------- */
    .count-badge {
        background: #020617;
        color: #ffffff;
        border-radius: 999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        border: 1px solid #334155;
    }

    /* ---------- INTERACTION ---------- */
    .company-name,
    .branch-name,
    .module-title {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: color 0.2s ease;
    }

    .company-name:hover,
    .branch-name:hover,
    .module-title:hover {
        color: #38bdf8;
    }

    /* ---------- ARROWS ---------- */
    .company-name::after,
    .branch-name::after,
    .module-title::after {
        content: "▸";
        font-size: 12px;
        margin-left: 8px;
        color: #94a3b8;
        transition: transform 0.25s ease;
    }

    .expanded::after {
        transform: rotate(90deg);
        color: #38bdf8;
    }
`).appendTo('head');
};
