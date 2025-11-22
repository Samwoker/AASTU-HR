import React from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";
import { MdAdd, MdDelete } from "react-icons/md";

export default function StepContactInfo({ formData, handleChange, updateFormData, errors = {} }) {
  const handleAddressChange = (field, value) => {
    updateFormData(field, value); // Since address fields are flat in formData
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phones];
    newPhones[index][field] = value;
    updateFormData("phones", newPhones);
  };

  const addPhone = () => {
    updateFormData("phones", [
      ...formData.phones,
      { number: "", type: "Private", isPrimary: false },
    ]);
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      updateFormData("phones", newPhones);
    }
  };

  return (
    <div className="space-y-8">
      {/* Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-k-dark-grey mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Region"
            value={formData.region}
            onChange={(e) => handleAddressChange("region", e.target.value)}
            placeholder="Optional"
          />
          <FormField
            label="City"
            value={formData.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            placeholder="Optional"
          />
          <FormField
            label="Sub City"
            value={formData.subCity}
            onChange={(e) => handleAddressChange("subCity", e.target.value)}
            placeholder="Optional"
          />
          <FormField
            label="Woreda"
            value={formData.woreda}
            onChange={(e) => handleAddressChange("woreda", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Phone Numbers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-k-dark-grey">Phone Numbers</h3>
          <Button variant="secondary" onClick={addPhone} icon={MdAdd} className="py-2! px-4! h-10! text-sm cursor-pointer">
            Add Phone
          </Button>
        </div>
        {errors.phones && <p className="text-error text-sm mb-4">{errors.phones}</p>}
        
        <div className="space-y-4">
          {formData.phones.map((phone, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phone Number */}
              <div className="flex-1">
                <FormField
                  label="Phone Number"
                  value={phone.number}
                  onChange={(e) => handlePhoneChange(index, "number", e.target.value)}
                  placeholder="09..."
                  required
                  error={errors[`phone_${index}`]}
                />
              </div>  
                
                <div>
                  <FormField
                    label="Type"
                    type="select"
                    value={phone.type}
                    onChange={(e) => handlePhoneChange(index, "type", e.target.value)}
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
                        const newPhones = formData.phones.map((p, i) => ({
                          ...p,
                          isPrimary: i === index,
                        }));
                        updateFormData("phones", newPhones);
                      }}
                      className="w-5 h-5 text-k-orange focus:ring-k-orange cursor-pointer"
                    />
                    <span className="text-sm text-k-dark-grey">Primary Number</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}
