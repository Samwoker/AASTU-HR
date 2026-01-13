import FormField from "../../common/FormField";
import Button from "../../common/Button";
import { MdAdd, MdDelete } from "react-icons/md";

type PhoneType = "Private" | "Office" | "Home" | "Emergency" | "Other";

interface ContactPhone {
  number: string;
  type: PhoneType;
  isPrimary: boolean;
}

interface StepContactInfoProps {
  formData: any;
  handleChange: (field: string, value: unknown) => void;
  updateFormData: (section: string, data: unknown) => void;
  errors?: Record<string, string | null | undefined>;
}

export default function StepContactInfo({
  formData,
  handleChange,
  updateFormData,
  errors = {},
}: StepContactInfoProps) {
  const handleAddressChange = (field: string, value: string) => {
    handleChange(field, value);
  };

  const handlePhoneChange = (
    index: number,
    field: keyof ContactPhone,
    value: string | boolean
  ) => {
    const newPhones = [...(formData.phones as ContactPhone[])];
    newPhones[index] = {
      ...newPhones[index],
      [field]: value,
    } as ContactPhone;
    updateFormData("phones", newPhones);
  };

  const addPhone = () => {
    updateFormData("phones", [
      ...formData.phones,
      { number: "", type: "Private", isPrimary: false },
    ]);
  };

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = (formData.phones as ContactPhone[]).filter(
        (_phone: ContactPhone, i: number) => i !== index
      );
      updateFormData("phones", newPhones);
    }
  };

  return (
    <div className="space-y-8">
      {/* Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-k-dark-grey mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Region"
            name="region"
            value={formData.region}
            onChange={(e) =>
              handleAddressChange(
                "region",
                (e.target as HTMLInputElement).value
              )
            }
            placeholder="Optional"
          />
          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) =>
              handleAddressChange("city", (e.target as HTMLInputElement).value)
            }
            placeholder="Optional"
          />
          <FormField
            label="Sub City"
            name="subCity"
            value={formData.subCity}
            onChange={(e) =>
              handleAddressChange(
                "subCity",
                (e.target as HTMLInputElement).value
              )
            }
            placeholder="Optional"
          />
          <FormField
            label="Woreda"
            name="woreda"
            value={formData.woreda}
            onChange={(e) =>
              handleAddressChange(
                "woreda",
                (e.target as HTMLInputElement).value
              )
            }
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Phone Numbers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-k-dark-grey">
            Phone Numbers
          </h3>
          <Button
            variant="secondary"
            onClick={addPhone}
            icon={MdAdd}
            className="py-2! px-4! h-10! text-sm cursor-pointer"
          >
            Add Phone
          </Button>
        </div>
        {errors.phones && (
          <p className="text-error text-sm mb-4">{errors.phones}</p>
        )}

        <div className="space-y-4">
          {(formData.phones as ContactPhone[]).map(
            (phone: ContactPhone, index: number) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Phone Number */}
                  <div className="flex-1">
                    <FormField
                      label="Phone Number"
                      name={`phones.${index}.number`}
                      value={phone.number}
                      onChange={(e) =>
                        handlePhoneChange(
                          index,
                          "number",
                          (e.target as HTMLInputElement).value
                        )
                      }
                      placeholder="+251..."
                      required
                      error={errors[`phone_${index}`] ?? undefined}
                    />
                  </div>

                  <div>
                    <FormField
                      label="Type"
                      type="select"
                      name={`phones.${index}.type`}
                      value={phone.type}
                      onChange={(e) =>
                        handlePhoneChange(
                          index,
                          "type",
                          (e.target as HTMLSelectElement).value
                        )
                      }
                    >
                      <option value="Private">Private</option>
                      <option value="Office">Office</option>
                      <option value="Home">Home</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Other">Other</option>
                    </FormField>
                  </div>

                  <div className="flex items-center h-full pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="primaryPhone"
                        checked={phone.isPrimary}
                        onChange={() => {
                          const newPhones = (
                            formData.phones as ContactPhone[]
                          ).map((p: ContactPhone, i: number) => ({
                            ...p,
                            isPrimary: i === index,
                          }));
                          updateFormData("phones", newPhones);
                        }}
                        className="w-5 h-5 text-k-orange focus:ring-k-orange cursor-pointer"
                      />
                      <span className="text-sm text-k-dark-grey">
                        Primary Number
                      </span>
                    </label>
                  </div>
                </div>

                {formData.phones.length > 1 && (
                  <button
                    onClick={() => removePhone(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-error transition-colors cursor-pointer"
                    title="Remove Phone"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
