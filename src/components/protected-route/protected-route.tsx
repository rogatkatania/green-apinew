import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../services/store/hooks";
import { _HOME_PATH, _LOGIN_PATH } from "../../utils/vars";
import Loading from "../loading/loading";
import { getAccount, getIsAuthChecked } from "../../services/account/selectors";

interface IProps {
    onlyAuth?: boolean;
    component: ReactElement;
}

const ProtectedRoute: FC<IProps> = ({ onlyAuth = true, component }) => {
    const isAuthChecked = useAppSelector(getIsAuthChecked);
    const user = useAppSelector(getAccount);

    if (!isAuthChecked) {
        // запрос в процессе
        return <Loading />;
    }

    if (user && !onlyAuth) {
        // пользователь авторизован, но роут для неавторизованных пользователей
        // редирект на главную или на location.state.from
        return <Navigate to={_HOME_PATH} />;
    }

    if (!user && onlyAuth) {
        // пользователь неавторизован, но роут для авторизованных пользователей
        return <Navigate to={_LOGIN_PATH} />;
    }

    // авторизация пользователя и доступ к роуту совпадают`
    return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ component }: { component: ReactElement }) => (
    <ProtectedRoute onlyAuth={false} component={component} />
);
