import { Footer } from "flowbite-react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsWhatsapp,
} from "react-icons/bs";

const MyFooter = () => {
  return (
    <Footer bgDark>
      <div className="w-full px-4 lg:px-24">
        <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.Title title="GIGO COMPANY LTD" />
            <Footer.LinkGroup col>
              <Footer.Link href="/about">Turi Bande?</Footer.Link>
              <Footer.Link href="/shop">Ibinyobwa</Footer.Link>
              <Footer.Link href="/blog">Amakuru</Footer.Link>
              <Footer.Link href="/contact">Twandikire</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Ibinyobwa" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Ibinyobwa Vyambiye</Footer.Link>
              <Footer.Link href="#">Ibinyobwa Bitambiye</Footer.Link>
              <Footer.Link href="#">Amananiza</Footer.Link>
              <Footer.Link href="#">Ibishasha</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Twandikire" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">+257 XX XX XX XX</Footer.Link>
              <Footer.Link href="#">info@gigocompany.com</Footer.Link>
              <Footer.Link href="#">Bujumbura, Burundi</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Amategeko" />
            <Footer.LinkGroup col>
              <Footer.Link href="#">Privacy Policy</Footer.Link>
              <Footer.Link href="#">Terms & Conditions</Footer.Link>
              <Footer.Link href="#">Customer Support</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="w-full border-t border-gray-600 px-4 py-6 sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="GIGO COMPANY LIMITED"
            year={new Date().getFullYear()}
          />
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsWhatsapp} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default MyFooter;
