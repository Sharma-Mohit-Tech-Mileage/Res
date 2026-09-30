// Maps the GetEquipmentByAccount API response to the rows ManageEquipmentCard renders.
const isPresent = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && s !== "*";
};

const modelLine = (e) =>
  [e?.manufacturer, e?.model_code].filter(isPresent).join(" - ");

export const isEeroEquipment = (equipment) =>
  isPresent(equipment?.serial_number) &&
  String(equipment?.equipment_category ?? "").trim() === "05" &&
  String(equipment?.manufacturer ?? "")
    .trim()
    .toUpperCase() === "EERO";

// Eero: equipment_category 05 + manufacturer EERO. Modem: equipment_category 03. serial_number must not be * for either.
export const transformEquipment = (apiData) => {
  const list = Array.isArray(apiData?.equipments) ? apiData.equipments : [];
  return list
    .map((e, i) => {
      const serial = e?.serial_number;
      if (!isPresent(serial)) return null;
      const category = String(e?.equipment_category ?? "").trim();

      if (isEeroEquipment(e)) {
        return {
          id: e?.internal_id || serial || `eero-${i}`,
          name: e?.equipment_description || e?.model || "Eero",
          model: modelLine(e),
          identifierLabel: "Serial Number",
          identifierValue: serial,
        };
      }
      if (category === "03") {
        return {
          id: e?.internal_id || serial || `modem-${i}`,
          name: "Sparklight Modem",
          model: modelLine(e),
          identifierLabel: "Mac ID",
          identifierValue: isPresent(e?.mac_address) ? e.mac_address : e?.cmac,
        };
      }
      return null;
    })
    .filter(Boolean);
};
