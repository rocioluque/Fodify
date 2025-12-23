import { Navigate } from "react-router-dom";
import { isAuth } from "../auth/isAuth";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  if (!isAuth()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
