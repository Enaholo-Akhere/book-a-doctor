import { jsx as _jsx } from "react/jsx-runtime";
import LoginComp from '@/components/Login';
const Login = () => {
    return (_jsx("section", { children: _jsx(LoginComp, {}) }));
};
export default Login;
