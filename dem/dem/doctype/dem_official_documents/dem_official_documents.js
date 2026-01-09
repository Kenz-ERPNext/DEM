// Copyright (c) 2026, sreejith and contributors
// For license information, please see license.txt

frappe.ui.form.on("DEM Official Documents", {
	refresh(frm) {
        frm.set_query("dem_branch", function () {
            return {
                filters: {
                    dem_company: frm.doc.dem_company
                }
            };
        });

	},
});
 