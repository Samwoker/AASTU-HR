import React, { useState } from "react";
import FormField from "../../../../components/common/FormField";
import Button from "../../../../components/common/Button";
import { MdSave, MdAdd, MdDelete, MdPhone, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function ContactDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    region: "Addis Ababa",
    city: "Addis Ababa",
    subCity: "Bole",
    woreda: "03",
    houseNumber: "1234",
    phones: [
      { number: "0911234567", type: "Private", isPrimary: true },
      { number: "0922345678", type: "Work", isPrimary: false }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phones];
    newPhones[index][field] = value;
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, { number: "", type: "Private", isPrimary: false }]
    }));
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, phones: newPhones }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Updating contact details:", formData);
    toast.success("Contact details updated successfully");
    setIsEditing(false);
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
            <h3 className="text-lg font-semibold text-k-dark-grey">Phone Numbers</h3>
            {isEditing && (
              <Button 
                type="button" 
                variant="text" 
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
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <FormField
                    label="Phone Number"
                    value={phone.number}
                    onChange={(e) => handlePhoneChange(index, "number", e.target.value)}
                    disabled={!isEditing}
                    icon={MdPhone}
                    placeholder="09..."
                  />
                  <FormField
                    label="Type"
                    type="select"
                    value={phone.type}
                    onChange={(e) => handlePhoneChange(index, "type", e.target.value)}
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
            <Button 
              variant="primary" 
              type="submit" 
              icon={MdSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
