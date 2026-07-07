import { feedbackSchema } from "../src/components/utility/validationSchema";

describe("feedbackSchema", () => {
  it("requires a contact consent selection", async () => {
    await expect(
      feedbackSchema.validateAt("cosentContactUs", {
        category: "compliment",
        feedbackValue: 5,
        areaOfConcern: [],
        feedbackText: "Great experience",
        feedbackEmail: "test@example.com",
        cosentContactUs: undefined,
      })
    ).rejects.toThrow("Please choose Yes or No to contact us.");
  });
});
