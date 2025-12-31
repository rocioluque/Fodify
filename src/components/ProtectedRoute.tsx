// import { Navigate } from "react-router-dom";
// import { isAuth } from "../auth/isAuth";

// type Props = {
//   children: React.ReactNode;
// };

// export function ProtectedRoute({ children }: Props) {
//   if (!isAuth()) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
