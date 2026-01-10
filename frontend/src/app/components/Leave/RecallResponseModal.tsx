import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import FormField from "../common/FormField";
import { LeaveRecall } from "../../slice/leaveSlice/types";
import { MdWarning, MdEvent } from "react-icons/md";

interface RecallResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  recall: LeaveRecall | null;
  onConfirm: (response: "ACCEPTED" | "DECLINED", actualReturnDate?: string, comments?: string) => void;
  loading?: boolean;
}

export default function RecallResponseModal({
  isOpen,
  onClose,
  recall,
  onConfirm,
  loading = false,
}: RecallResponseModalProps) {
  const [response, setResponse] = useState<"ACCEPTED" | "DECLINED">("ACCEPTED");
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [comments, setComments] = useState("");

  // Set default return date when modal opens with a recall
  React.useEffect(() => {
    if (recall && recall.recall_date) {
      setActualReturnDate(recall.recall_date.split("T")[0]);
    }
  }, [recall]);

  if (!recall) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Respond to Leave Recall"
      size="lg"
    >
      <div className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-4 items-start text-orange-800">
          <MdWarning className="text-2xl shrink-0 text-orange-500" />
          <div className="text-sm">
            <p className="font-bold mb-1">Manager Recall Request</p>
            <p>
              Your manager has requested you to return to work on{" "}
              <strong>{new Date(recall.recall_date).toLocaleDateString()}</strong>.
            </p>
            {recall.reason && (
              <p className="mt-2 italic">Reason: "{recall.reason}"</p>
            )}
          </div>
        </div>

        {/* Response Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setResponse("ACCEPTED")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              response === "ACCEPTED"
                ? "border-k-orange bg-orange-50"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <p className="font-bold text-k-dark-grey">Accept Recall</p>
            <p className="text-xs text-gray-500 mt-1">
              I will return to work on the specified date. Remaining leave days will be refunded.
            </p>
          </button>
          <button
            onClick={() => setResponse("DECLINED")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              response === "DECLINED"
                ? "border-red-500 bg-red-50"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <p className="font-bold text-red-600">Decline Recall</p>
            <p className="text-xs text-gray-500 mt-1">
              I am unable to return early. I will provide a reason.
            </p>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {response === "ACCEPTED" && (
            <FormField
              label="Actual Return Date"
              type="date"
              name="actual_return_date"
              value={actualReturnDate}
              onChange={(e) => setActualReturnDate(e.target.value)}
              required
              icon={MdEvent}
            />
          )}

          <FormField
            label={response === "ACCEPTED" ? "Comments (Optional)" : "Reason for Declining"}
            type="textarea"
            name="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={
              response === "ACCEPTED"
                ? "Add any notes for your manager..."
                : "Explain why you cannot accept the recall..."
            }
            required={response === "DECLINED"}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={response === "ACCEPTED" ? "primary" : "secondary"}
            className={response === "DECLINED" ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100" : ""}
            onClick={() => onConfirm(response, actualReturnDate, comments)}
            loading={loading}
            disabled={response === "DECLINED" && !comments.trim()}
          >
            {response === "ACCEPTED" ? "Submit Acceptance" : "Submit Decline"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
