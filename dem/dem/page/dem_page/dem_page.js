frappe.pages['dem-page'].on_page_load = function (wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Document Expiry Management',
        single_column: true
    });

    /* ================= ADD STYLES ================= */
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .dem-wrapper {
                display: flex;
                min-height: 85vh;
                font-family: Arial, sans-serif;
            }

            /* ===== LEFT NAVBAR ===== */
            .dem-sidebar {
                width: 260px;
                background: #f9f9f9;
                border-right: 1px solid #ddd;
                padding: 15px;
            }

            .dem-menu-title {
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 15px;
                color: #555;
                text-transform: uppercase;
            }

            .dem-menu-item {
                padding: 10px 12px;
                margin-bottom: 6px;
                cursor: pointer;
                border-radius: 6px;
                border: 1px solid transparent;
                transition: all 0.3s;
                font-size: 14px;
                display: flex;
                align-items: center;
            }

            .dem-menu-item i {
                margin-right: 10px;
                font-size: 15px;
                color: #5e64ff;
            }

            .dem-menu-item:hover {
                background: #e8f0fe;
                border-color: #c7d2fe;
            }

            /* ===== RIGHT CONTENT ===== */
            .dem-content {
                flex: 1;
                padding: 25px;
                background: #fff;
            }

            /* ===== DASHBOARD CARDS ===== */
            .dem-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 20px;
            }

            .dem-card {
                background: #fdfdfd;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                display: flex;
                align-items: center;
                transition: all 0.3s;
            }

            .dem-card:hover {
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                transform: translateY(-3px);
            }

            .dem-card-icon {
                font-size: 30px;
                margin-right: 15px;
                color: #5e64ff;
            }

            .dem-card-count {
                font-size: 28px;
                font-weight: bold;
                color: #333;
            }

            .dem-card-label {
                font-size: 13px;
                color: #777;
                margin-top: 3px;
            }
        `)
        .appendTo('head');

    /* ================= PAGE HTML ================= */
    $(`
        <div class="dem-wrapper">
            <div class="dem-sidebar">
                <div class="dem-menu-title">Navigation</div>

                <div class="dem-menu-item" data-route="company-branch-tree">
                    <i class="fa fa-sitemap"></i> Company Hierarchy
                </div>

                <div class="dem-menu-item" data-doctype="DEM Company">
                    <i class="fa fa-building"></i> Company
                </div>

                <div class="dem-menu-item" data-doctype="DEM Branch">
                    <i class="fa fa-code-fork"></i> Branch
                </div>

                <div class="dem-menu-item" data-doctype="DEM Employee">
                    <i class="fa fa-users"></i> Employee
                </div>

                <div class="dem-menu-item" data-doctype="DEM Vehicle">
                    <i class="fa fa-car"></i> Vehicle
                </div>

                <div class="dem-menu-item" data-doctype="DEM Official Documents">
                    <i class="fa fa-file-text"></i> Official Documents
                </div>
            </div>

            <div class="dem-content">
                <div class="dem-cards" id="dem-cards"></div>
            </div>
        </div>
    `).appendTo(page.body);

    /* ================= NAVIGATION ================= */
    $('.dem-menu-item').on('click', function () {
        const route = $(this).data('route');
        const doctype = $(this).data('doctype');

        if (route) {
            frappe.set_route(route);
        } else {
            frappe.set_route('List', doctype);
        }
    });

    /* ================= COUNTS ================= */
    const doctypes = [
        { label: 'Companies', doctype: 'DEM Company', icon: 'fa-building' },
        { label: 'Branches', doctype: 'DEM Branch', icon: 'fa-code-fork' },
        { label: 'Employees', doctype: 'DEM Employee', icon: 'fa-users' },
        { label: 'Vehicles', doctype: 'DEM Vehicle', icon: 'fa-car' },
        { label: 'Official Documents', doctype: 'DEM Official Documents', icon: 'fa-file-text' }
    ];

    doctypes.forEach(d => {
        frappe.call({
            method: 'frappe.client.get_count',
            args: { doctype: d.doctype },
            callback: function (r) {
                $('#dem-cards').append(`
                    <div class="dem-card">
                        <div class="dem-card-icon">
                            <i class="fa ${d.icon}"></i>
                        </div>
                        <div>
                            <div class="dem-card-count">${r.message || 0}</div>
                            <div class="dem-card-label">${d.label}</div>
                        </div>
                    </div>
                `);
            }
        });
    });
};
