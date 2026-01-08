frappe.pages['company-branch-tree'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Company & Branches',
        single_column: true
    });

    // Container for the tree
    var container = $('<div class="company-branch-tree"></div>');
    $(wrapper).append(container);

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'DEM Company',
            fields: ['name']
        },
        callback: function(companies) {
            companies.message.forEach(function(c) {
                // Create company div (clickable)
                var companyDiv = $(`
                    <div class="company">
                        <span class="company-name">${c.name}</span>
                        <ul class="branch-list" style="display:none;"></ul>
                    </div>
                `);

                // Fetch branches for this company
                frappe.call({
                    method: 'frappe.client.get_list',
                    args: {
                        doctype: 'DEM Branch',
                        filters: { dem_company: c.name },
                        fields: ['name']
                    },
                    async: false,
                    callback: function(branches) {
                        var branchList = companyDiv.find('.branch-list');
                        branches.message.forEach(function(b) {
                            branchList.append(`<li>${b.name}</li>`);
                        });
                    }
                });

                container.append(companyDiv);
            });

            // Toggle branches on company click
            $('.company-name').on('click', function() {
                $(this).siblings('.branch-list').slideToggle();
                $(this).toggleClass('expanded');
            });
        }
    });

    // Add styles
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .company-branch-tree { font-family: Arial, sans-serif; }
            .company { margin-bottom: 10px; cursor: pointer; border: 1px solid #ddd; border-radius: 5px; padding: 10px; background: #f9f9f9; transition: background 0.3s; }
            .company:hover { background: #e8f0fe; }
            .company-name { font-weight: bold; display: block; position: relative; }
            .company-name::after { content: "\\25B6"; font-size: 12px; position: absolute; right: 0; transition: transform 0.3s; }
            .company-name.expanded::after { transform: rotate(90deg); }
            .branch-list { margin-top: 5px; padding-left: 20px; list-style-type: disc; }
            .branch-list li { padding: 5px 0; }
        `)
        .appendTo('head');
}
