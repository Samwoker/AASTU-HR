import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import FormField from "../../../../components/common/FormField";
import Button from "../../../../components/common/Button";
import { MdSave, MdAdd, MdDelete, MdPhone, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import onboardingService from "../../../../services/onboardingService";

type PhoneType = "Private" | "Work" | "Home";

interface ContactPhone {
  number: string;
  type: PhoneType;
  isPrimary: boolean;
}

interface ContactFormData {
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  houseNumber: string;
  phones: ContactPhone[];
}

interface ContactDetailsProps {
  initialData?: Partial<ContactFormData> | null;
  onRefresh?: () => void | Promise<void>;
}

type ContactFieldName = keyof Omit<ContactFormData, "phones">;

export default function ContactDetails({
  initialData,
  onRefresh,
}: ContactDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    region: "",
    city: "",
    subCity: "",
    woreda: "",
    houseNumber: "",
    phones: [{ number: "", type: "Private", isPrimary: true }],
  });

  useEffect(() => {
    if (!isEditing && initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        phones:
          Array.isArray(initialData.phones) && initialData.phones.length > 0
            ? initialData.phones
            : prev.phones,
      }));
    }
  }, [initialData, isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as ContactFieldName;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handlePhoneChange = (
    index: number,
    field: keyof ContactPhone,
    value: ContactPhone[keyof ContactPhone]
  ) => {
    const newPhones = [...formData.phones];
    newPhones[index] = {
      ...newPhones[index],
      [field]: value,
    } as ContactPhone;
    setFormData((prev) => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [
        ...prev.phones,
        { number: "", type: "Private", isPrimary: false },
      ],
    }));
  };

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, phones: newPhones }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const save = async () => {
      const loadingToast = toast.loading("Saving contact details...");
      try {
        await onboardingService.updateContactInfo({
          region: formData.region || undefined,
          city: formData.city || undefined,
          subCity: formData.subCity || undefined,
          woreda: formData.woreda || undefined,
          phones: (formData.phones || []).map((phone) => ({
            number: phone.number,
            type: phone.type || "Private",
            isPrimary: !!phone.isPrimary,
          })),
        });
        toast.dismiss(loadingToast);
        toast.success("Contact details updated successfully");
        setIsEditing(false);
        if (onRefresh) await onRefresh();
      } catch (error) {
        toast.dismiss(loadingToast);
        const err = error as any;
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update contact details"
        );
      }
    };

    save();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Contact Details</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            icon={MdEdit}
            onClick={() => setIsEditing(true)}
          >
            Edit Details
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FormField
            label="Region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="Sub City"
            name="subCity"
            value={formData.subCity}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="Woreda"
            name="woreda"
            value={formData.woreda}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="House Number"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-k-dark-grey">
              Phone Numbers
            </h3>
            {isEditing && (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={addPhone}
                icon={MdAdd}
                className="text-k-orange hover:bg-orange-50"
              >
                Add Phone
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {formData.phones.map((phone, index) => (
              <div
                key={index}
                className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <FormField
                    label="Phone Number"
                    name={`phones.${index}.number`}
                    value={phone.number}
                    onChange={(e) =>
                      handlePhoneChange(index, "number", e.target.value)
                    }
                    disabled={!isEditing}
                    icon={MdPhone}
                    placeholder="+251..."
                  />
                  <FormField
                    label="Type"
                    type="select"
                    name={`phones.${index}.type`}
                    value={phone.type}
                    onChange={(e) =>
                      handlePhoneChange(index, "type", e.target.value)
                    }
                    disabled={!isEditing}
                    options={[
                      { value: "Private", label: "Private" },
                      { value: "Work", label: "Work" },
                      { value: "Home", label: "Home" },
                    ]}
                  />
                </div>
                {isEditing && formData.phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="mt-8 text-error hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={MdSave}>
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
