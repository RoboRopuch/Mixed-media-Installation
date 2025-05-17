import { HOME_TITLE, HOME_SUBTITLE } from '../../constants';

export const HomeScreen = () => {
    return (
        <div className="home-screen" role="main" aria-label="Home Screen">
            <h1>{HOME_TITLE}</h1>
            <p>{HOME_SUBTITLE}</p>
        </div>
    );
};
