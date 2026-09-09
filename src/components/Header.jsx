import logoImg from '../assets/logo.jpg';

export default function Header() {
    return (
        <header id="main-header">
            <div id="title">
                <img src={logoImg} alt="Logo" />
                <h1>ReactFood</h1>
            </div>

            <nav>
                <button>Cart (0)</button>
                <button>About</button>
                <button>Contact</button>
            </nav>
        </header>
    );
}