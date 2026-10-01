// Maps the GetInternetData API response to the rows ManageEquipmentCard renders.
const isPresent = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && s !== "*";
};

export const isEeroEquipment = (equipment) =>
  isPresent(equipment?.serial_number) &&
  String(equipment?.manufacturer ?? "")
    .trim()
    .toUpperCase() === "EERO";

export const isModemEquipment = (equipment) =>
  isPresent(equipment?.serial_number) &&
  String(equipment?.equipment_category ?? "").trim() === "03" &&
  String(equipment?.manufacturer ?? "")
    .trim()
    .toLowerCase() !== "error";

// Skip placeholders and distinguish Eero devices from provider modems.
export const transformEquipment = (apiData) => {
  const list = Array.isArray(apiData?.equipments) ? apiData.equipments : [];
  return list
    .filter(
      (e) =>
        e &&
        isPresent(e.serial_number) &&
        String(e.manufacturer ?? "")
          .trim()
          .toLowerCase() !== "error",
    )
    .map((e, i) => ({
      id: e.internal_id || e.serial_number || `modem-${i}`,
      name: isEeroEquipment(e)
        ? e.equipment_description || "Eero"
        : "Sparklight Modem",
      model: isPresent(e.model_code) ? e.model_code : "—",
      identifierLabel: isEeroEquipment(e) ? "Serial Number" : "Mac ID",
      identifierValue: isPresent(e.serial_number) ? e.serial_number : "—",
    }));
};
