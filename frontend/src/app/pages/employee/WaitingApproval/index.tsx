import { useNavigate } from "react-router-dom";
import { MdOutlineTimer, MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import Button from "../../../components/common/Button";
import { useAuthSlice } from "../../../slice/authSlice";
import loginBg from "../../../../assets/images/login_bg_image.jpg";

export default function WaitingApproval() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { actions } = useAuthSlice();

  const handleLogout = () => {
    dispatch(actions.logout());
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>

      <div className="relative z-10 w-full max-w-[520px] mx-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-white/70 backdrop-blur-sm p-10 text-center space-y-8 border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-[#FFF9E6] text-[#FFCC00] rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-inner animate-pulse">
            <MdOutlineTimer />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-gray-500 text-xl leading-relaxed max-w-md mx-auto">
              Your onboarding details have been successfully received. Our HR
              team is currently reviewing your profile.
            </p>
          </div>

          <div className="bg-[#F1F5F9] p-6 rounded-2xl flex items-start gap-4 text-left border border-gray-200">
            <div className="w-1.5 h-full bg-[#FFCC00] rounded-full mt-1 shrink-0" />
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Next Steps</h3>
              <p className="text-gray-600">
                You will receive an email notification once your account is
                approved. After that, you'll have full access to the employee
                dashboard.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <p className="text-gray-400 text-sm">
              Usually takes 24-48 hours for review.
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              icon={MdLogout}
              className="w-full py-4 text-lg border-2 hover:bg-gray-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
