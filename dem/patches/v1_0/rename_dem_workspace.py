import frappe


def execute():
	"""Rename the public "Document Expiry Management" workspace to "DEM".

	A workspace's route is derived from its document `name` while the sidebar
	link is built from its `title`. Keeping the long name with title="DEM" made
	the sidebar link to /app/dem while the record resolved elsewhere ->
	"Page dem not found". Renaming the record keeps them in sync.

	Idempotent and order-independent (handles the new DEM JSON already being
	imported during the same migrate).
	"""
	if not frappe.db.table_exists("Workspace"):
		return

	old = "Document Expiry Management"
	has_old = frappe.db.exists("Workspace", old)
	has_new = frappe.db.exists("Workspace", "DEM")

	if has_old and has_new:
		frappe.delete_doc("Workspace", old, force=True, ignore_permissions=True)
	elif has_old:
		frappe.rename_doc("Workspace", old, "DEM", force=True)

	if frappe.db.exists("Workspace", "DEM"):
		frappe.db.set_value(
			"Workspace", "DEM", {"title": "DEM", "label": "DEM"}, update_modified=False
		)

	frappe.db.commit()
