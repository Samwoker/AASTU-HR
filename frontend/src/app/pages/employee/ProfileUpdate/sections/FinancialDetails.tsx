import React, { useState } from "react";
import FormField from "../../../../components/common/FormField";
import Button from "../../../../components/common/Button";
import { MdSave, MdAdd, MdDelete, MdAttachMoney, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function FinancialDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    financials: [
      { 
        bankName: "Commercial Bank of Ethiopia", 
        accountNumber: "1000123456789", 
        accountName: "Biruk Dawit",
        isPrimary: true
      }
    ]
  });

  const handleChange = (index, field, value) => {
    const newFinancials = [...formData.financials];
    newFinancials[index][field] = value;
    setFormData(prev => ({ ...prev, financials: newFinancials }));
  };

  const addFinancial = () => {
    setFormData(prev => ({
      ...prev,
      financials: [...prev.financials, { 
        bankName: "", 
        accountNumber: "", 
        accountName: "",
        isPrimary: false
      }]
    }));
  };

  const removeFinancial = (index) => {
    if (formData.financials.length > 0) {
      const newFinancials = formData.financials.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, financials: newFinancials }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Updating financial details:", formData);
    toast.success("Financial details updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Financial Details</h2>
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
        <div className="mb-8">
          <div className="flex justify-end mb-4">
            {isEditing && (
              <Button 
                type="button" 
                variant="text" 
                size="sm" 
                onClick={addFinancial}
                icon={MdAdd}
                className="text-k-orange hover:bg-orange-50"
              >
                Add Bank Account
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {formData.financials.map((financial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                <div className="flex items-center gap-2 mb-4 text-k-orange font-medium">
                  <MdAttachMoney size={20} />
                  <span>Account {index + 1}</span>
                  {financial.isPrimary && (
                    <span className="text-xs bg-orange-100 text-k-orange px-2 py-1 rounded-full ml-2">Primary</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Bank Name"
                    value={financial.bankName}
                    onChange={(e) => handleChange(index, "bankName", e.target.value)}
                    disabled={!isEditing}
                    required
                  />

                  <FormField
                    label="Account Number"
                    value={financial.accountNumber}
                    onChange={(e) => handleChange(index, "accountNumber", e.target.value)}
                    disabled={!isEditing}
                    required
                  />

                  <div className="md:col-span-2">
                    <FormField
                      label="Account Name"
                      value={financial.accountName}
                      onChange={(e) => handleChange(index, "accountName", e.target.value)}
                      disabled={!isEditing}
                      required
                      helperText="As it appears on your bank book"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeFinancial(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-error transition-colors p-2 hover:bg-red-50 rounded-lg"
                    title="Remove"
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </div>
            ))}
            
            {formData.financials.length === 0 && (
               <div className="text-center py-8 text-k-medium-grey bg-gray-50 rounded-xl border border-dashed">
                  No financial details added yet.
               </div>
            )}
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
