import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/landing.module.css";
import Asus from "../assets/image/asus.png";
import ChatAI from "../components/ChatAI";
import MapComponent from "../components/MapComponents";
import ProgressMicro from "../components/micro/ProgressMicro";
import Products from "../components/products/Products";
import PromoRotator from "../components/promo/PromoRotator";
import MicroCircle from "../components/micro/MicroCircle";
import { ImInfo } from "react-icons/im";
import { LuGoal } from "react-icons/lu";
import { MdFactCheck } from "react-icons/md";
import { RiSearchEyeLine } from "react-icons/ri";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaMap } from "react-icons/fa";
import {
  Fa1,
  FaMapLocation,
  FaMapLocationDot,
  FaMessage,
} from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Landing() {
  const nav = useNavigate();
  const [viewModel, setViewModel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setViewModel(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const sectionIds = ["home", "about", "parts", "accessory", "contact"];
  const refs = useRef({});
  const [visibleSection, setVisibleSection] = useState(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) {
      return;
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.25, 0.4, 0.5, 0.75, 1],
    };

    const observer = new IntersectionObserver((entries) => {
      let best = null;
      for (const entry of entries) {
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      }

      if (best && best.intersectionRatio > 0) {
        setVisibleSection(best.target.id);
      } else {
        setVisibleSection(null);
      }
    }, options);

    elements.forEach((el) => observer.observe(el));

    const pickInitial = () => {
      const viewportCenterY = window.innerHeight / 2;
      let closest = null;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - viewportCenterY);
        if (!closest || dist < closest.dist) {
          closest = { el, dist };
        }
      }
      if (closest && closest.el) setVisibleSection(closest.el.id);
    };
    pickInitial();

    return () => {
      observer.disconnect();
    };
  }, []);

  const videoRef = useRef(null);
  const [centerContent, setCenterContent] = useState(false);

  const handleMouseEnter = () => {
    videoRef.current.pause();
    setCenterContent(true);
  };

  const handleMouseLeave = () => {
    videoRef.current.play();
    setCenterContent(false);
  };

  const modelClass = () => {
    switch (visibleSection) {
      case "home":
        return styles.modelHome;
      case "about":
        return styles.modelAbout;
      case "parts":
        return styles.modelParts;
      case "accessory":
        return styles.modelAccessory;
      case "contact":
        return styles.modelContact;
      default:
        return styles.modelHome;
    }
  };

  const [OTV_parts, setOTV_parts] = useState(false);
  const partsClass = (parts1, parts2) => {
    // return `${parts1} ${visibleSection === "parts" ? parts2 : ""}`;
    if (!OTV_parts) {
      if (visibleSection === "parts") {
        setOTV_parts(true);
        return `${parts1} ${parts2}`;
      } else {
        return `${parts1}`;
      }
    } else {
      return `${parts1} ${parts2}`;
    }
  };

  const [OTV_accessory, setOTV_accessory] = useState(false);
  const accessClass = (accessory1, accessory2) => {
    // return `${accessory1} ${visibleSection === "accessory" ? accessory2 : ""}`;
    if (!OTV_accessory) {
      if (visibleSection === "accessory") {
        setOTV_accessory(true);
        return `${accessory1} ${accessory2}`;
      } else {
        return `${accessory1}`;
      }
    } else {
      return `${accessory1} ${accessory2}`;
    }
  };

  const [OTV_contact, setOTV_contact] = useState(false);
  const contactClass = (contact1, contact2) => {
    // return `${contact1} ${visibleSection === "contact" ? contact2 : ""}`;
    if (!OTV_contact) {
      if (visibleSection === "contact") {
        setOTV_contact(true);
        return `${contact1} ${contact2}`;
      } else {
        return `${contact1}`;
      }
    } else {
      return `${contact1} ${contact2}`;
    }
  };

  const [OTV_about, setOTV_about] = useState(false);
  const aboutClass = (about1, about2) => {
    // return `${about1} ${visibleSection === "about" ? about2 : ""}`;
    if (!OTV_about) {
      if (visibleSection === "about") {
        setOTV_about(true);
        return `${about1} ${about2}`;
      } else {
        return `${about1}`;
      }
    } else {
      return `${about1} ${about2}`;
    }
  };

  const [group, setGroup] = useState("parts");

  const [aboutText, setAboutText] = useState("btn1");

  return (
    <div className={styles.mainContainer}>
      <ul>
        {/* ====================================================================== */}
        {/* Home */}
        {/* ====================================================================== */}

        <li
          className={styles.home}
          id="home"
          ref={(el) => (refs.current["home"] = el)}
        >
          {/* 3d Model PC */}
          <div className={modelClass()}>
            {/* {viewModel && <ModelComputer />} */}
            <video
              ref={videoRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              src="/videos/model-3d_alpha.webm"
              autoPlay
              loop
              muted
              className={styles.model}
            />
          </div>

          <div className={styles.topContent}>
            <div className={styles.left}>
              <div className={styles.box} />
              <div className={styles.box} />
              <div className={styles.box} />
            </div>
            <div className={styles.center}>
              <img src={Asus} alt="Asus Logo" />
            </div>
            <div className={styles.right}>
              <div className={styles.box} />
              <div className={styles.box} />
              <div className={styles.box} />
            </div>
          </div>

          <div
            className={`${styles.centerContent} ${
              centerContent ? styles.viewCenterContent : ""
            }`}
          >
            <p className={styles.s1}>Ultra-fast latest-gen processor</p>
            <p className={styles.s2}>High-performance dedicated graphics</p>
            <p className={styles.s3}>Turbo-speed DDR4/DDR5 memory</p>
            <p className={styles.s4}>Lightning-fast NVMe SSD storage</p>
            <p className={styles.s5}>Advanced cooling for stable performance</p>
          </div>

          <div className={styles.intro}>
            <div className={styles.text}>
              <div className={styles.title}>
                <h2>Build Your Dream PC</h2>
                <p>
                  Powered by ASUS. Engineered with ROG performance. Build a PC
                  that dominates the battlefield.
                </p>
                <button
                  className={styles.btnShop}
                  onClick={() => nav("/order-page")}
                >
                  <span className={styles.btnLg}>
                    <span className={styles.btnSl}></span>
                    <span className={styles.btntext}>Shop Now</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <img
            className={styles.logoWord}
            src="image/logo-asus.png"
            alt="logo"
          />

          <div className={styles.circleContent}>
            <MicroCircle />
          </div>
        </li>

        {/* ============================================================================ */}
        {/* About */}
        {/* ============================================================================ */}

        <li
          className={styles.about}
          id="about"
          ref={(el) => (refs.current["about"] = el)}
        >
          <div className={aboutClass(styles.chat, styles.chat1)}>
            <ChatAI />
          </div>
          <div
            className={aboutClass(styles.infoMultiBtn, styles.infoMultiBtn1)}
          >
            <div className={styles.btn1}>
              <button onClick={() => setAboutText("btn1")}>
                <ImInfo />
              </button>
            </div>
            <div className={styles.btn2}>
              <button onClick={() => setAboutText("btn2")}>
                <LuGoal />
              </button>
            </div>
            <div className={styles.btn3}>
              <button onClick={() => setAboutText("btn3")}>
                <FaMapLocationDot />
              </button>
            </div>
            <div className={styles.btn4}>
              <button onClick={() => setAboutText("btn4")}>
                <MdFactCheck />
              </button>
            </div>
            <div className={styles.btn5}>
              <button onClick={() => setAboutText("btn5")}>
                <AiOutlineQuestionCircle />
              </button>
            </div>
            <div className={styles.btn6}>
              <button onClick={() => setAboutText("btn6")}>
                <FaMessage />
              </button>
            </div>
          </div>
          <div className={aboutClass(styles.aboutText, styles.aboutText1)}>
            {aboutText === "btn1" && (
              <p className={styles.p1}>
                <span>About Us</span> <br />
                ASUS ROG Your Local ROG Specialist <br />
                <br /> We are a dedicated ASUS ROG-focused PC shop based in
                Batangas. From curated prebuilt systems to custom high-end
                gaming rigs, we deliver genuine ASUS parts, professional
                assembly, and dependable after-sales support. Our team tests and
                tunes every build to ensure stable performance out of the box,
                whether you are streaming, competing, or creating.
              </p>
            )}
            {aboutText === "btn2" && (
              <p className={styles.p2}>
                <span>Mission</span> <br />
                To provide accessible, high-quality ASUS ROG gaming systems and
                services that prioritize performance, reliability, and an
                excellent customer experience.
                <span className={styles.vision}>Vision</span> <br />
                To be the most trusted ASUS ROG partner in our region,
                empowering local gamers and creators with world-class builds,
                education, and community events.
              </p>
            )}
            {aboutText === "btn3" && (
              <div className={styles.map}>
                <MapComponent />
              </div>
            )}
            {aboutText === "btn4" && (
              <p className={styles.p3}>
                <span>Why Choose Us</span> <br />
                <div className={styles.p31}>
                  • <strong>Official ASUS partner</strong>
                  <p>authentic components and direct warranty coordination.</p>
                </div>
                <div className={styles.p32}>
                  • <strong>Custom tuning & testing</strong>
                  <p>
                    performance optimization, cable management, and benchmark
                    verification before delivery.
                  </p>
                </div>
                <div className={styles.p33}>
                  • <strong>Fast, friendly supportr</strong>
                  <p>
                    on-site or remote help, plus a product feedback & chat
                    assistant.
                  </p>
                </div>
                <div className={styles.p34}>
                  • <strong>Transparent pricing</strong>
                  <p>
                    itemized quotes and no hidden fees, upgrade recommendations
                    based on your use case.
                  </p>
                </div>
              </p>
            )}
            {aboutText === "btn5" && (
              <p className={styles.p4}>
                <span>FAQ</span> <br />
                <h3>
                  How long does a custom build take?
                  <h4>
                    Typically 3–7 business days, depending on part availability
                    and queue. Rush builds available for a fee.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  Are the parts genuine?
                  <h4>
                    Yes! we use authentic ASUS and OEM parts only. We’re an
                    authorized partner and provide manufacturer warranties where
                    applicable.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  What warranty do you offer?
                  <h4>
                    We provide a 1-year local assembly warranty plus the
                    original manufacturer warranty on individual parts (GPU,
                    CPU, SSD, etc.). We also handle RMA coordination.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  Do you ship nationwide?
                  <h4>
                    Yes! we ship using trusted couriers. Local pickup is
                    available at the store for those nearby.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  What payment methods do you accept?
                  <h4>
                    We accept bank transfer, major credit/debit cards, and
                    common e-wallets. Secure checkout and invoices are provided
                    for every order.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  Can I request system tuning or overclocking?
                  <h4>
                    Yes! we offer performance tuning and conservative
                    overclocking services with stability testing. Overclocking
                    may affect warranty terms; we’ll advise beforehand.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  What if my PC has an issue after delivery?
                  <h4>
                    Contact our support or use the chat assistant. We’ll
                    diagnose remotely where possible; if needed, bring the
                    system in for inspection or initiate an RMA.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  Do you offer upgrades and repairs?
                  <h4>
                    Yes! diagnostics, part replacement, upgrades, and clean
                    builds are available. We’ll provide an estimate before any
                    work.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  How do I book a consultation?
                  <h4>
                    Send us request trough email, or call the store. We can do
                    in-person or online consultations to plan your build.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
                <h3>
                  Do you offer discounts or promos?
                  <h4>
                    Occasionally. Sign up for our newsletter or follow our
                    events page for promo codes, demo days, and exclusive
                    bundles.
                  </h4>
                  <IoMdArrowDropdown className={styles.arrowCon} />
                </h3>
              </p>
            )}
            {aboutText === "btn6" && (
              <>
                <div className={aboutClass(styles.chat2, styles.chat3)}>
                  <h2>Your Chat Bot Assistant</h2>
                  <ChatAI />
                </div>
              </>
            )}
          </div>
        </li>

        {/* ============================================================================ */}
        {/* Parts */}
        {/* ============================================================================ */}

        <li
          className={styles.parts}
          id="parts"
          ref={(el) => (refs.current["parts"] = el)}
        >
          <div className={styles.partLeft}>
            <img
              className={partsClass(styles.part1, styles.part10)}
              src="/image/ram.png"
              alt="ram rog"
            />
            <img
              className={partsClass(styles.part2, styles.part20)}
              src="/image/mb-main.png"
              alt="mobo rog"
            />
            <img
              className={partsClass(styles.part3, styles.part30)}
              src="/image/gpu-rog.png"
              alt="gpu rog"
            />
          </div>
          <div className={styles.partRight}>
            <img
              className={partsClass(styles.part4, styles.part40)}
              src="/image/psu.png"
              alt="psu rog"
            />
            <img
              className={partsClass(styles.part5, styles.part50)}
              src="/image/case.png"
              alt="case rog"
            />
            <img
              className={partsClass(styles.part6, styles.part60)}
              src="/image/cooler.png"
              alt="cooler rog"
            />
          </div>
          <div className={partsClass(styles.partText, styles.partTextView)}>
            <div className={styles.pText1}>
              <h1>ASUS ROG Strix 64GB (2×32) DDR5 6000MHz</h1>
              <h3>High-speed memory built for creators and power users.</h3>
            </div>

            <div className={styles.pText2}>
              <h1>ASUS ROG Crosshair X670E Hero</h1>
              <h3>The ultimate control center for elite AMD setups.</h3>
            </div>

            <div className={styles.pText3}>
              <h1>ASUS ROG Strix GeForce RTX 4080 SUPER OC 16GB</h1>
              <h3>Flagship graphics power with iconic ROG performance.</h3>
            </div>

            <div className={styles.pText4}>
              <h1>ASUS ROG Thor 1200W Platinum II</h1>
              <h3>Premium power delivery for high-end builds.</h3>
            </div>

            <div className={styles.pText5}>
              <h1>ASUS ROG Strix Helios GX601</h1>
              <h3>
                A show-stopping chassis that turns your build into a statement
                piece.
              </h3>
            </div>

            <div className={styles.pText6}>
              <h1>ASUS ROG Ryujin III 360 ARGB</h1>
              <h3>Premium liquid cooling with powerful ARGB presence.</h3>
            </div>
          </div>
        </li>

        {/* =============================================================================== */}
        {/* Accessory */}
        {/* =============================================================================== */}

        <li
          className={styles.accessory}
          id="accessory"
          ref={(el) => (refs.current["accessory"] = el)}
        >
          <div className={accessClass(styles.promo, styles.promo1)}>
            <PromoRotator />
            <button
              className={styles.btnShop}
              onClick={() => nav("/order-page")}
            >
              <span className={styles.btnLg}>
                <span className={styles.btnSl}></span>
                <span className={styles.btntext}>Shop Now</span>
              </span>
            </button>
          </div>
          <div className={accessClass(styles.products, styles.products1)}>
            <div className={styles.filterProducts}>
              <button
                className={`${styles.filterBtn} ${
                  group === "parts" ? styles.filterActive : ""
                }`}
                onClick={() => setGroup("parts")}
              >
                <span className={styles.filterLg}>
                  <span className={styles.filterSg}></span>
                  <span className={styles.filterText}>Parts</span>
                </span>
              </button>
              <button
                className={`${styles.filterBtn} ${
                  group === "accessory" ? styles.filterActive : ""
                }`}
                onClick={() => setGroup("accessory")}
              >
                <span className={styles.filterLg}>
                  <span className={styles.filterSg}></span>
                  <span className={styles.filterText}>Accessory</span>
                </span>
              </button>
              <button
                className={`${styles.filterBtn} ${
                  group === "fullbuild" ? styles.filterActive : ""
                }`}
                onClick={() => setGroup("fullbuild")}
              >
                <span className={styles.filterLg}>
                  <span className={styles.filterSg}></span>
                  <span className={styles.filterText}>Fullbuild</span>
                </span>
              </button>
            </div>
            <Products viewedProduct={group} />
          </div>
        </li>

        <li
          className={styles.contact}
          id="contact"
          ref={(el) => (refs.current["contact"] = el)}
        >
          <div
            className={contactClass(styles.contactInner, styles.contactInner1)}
          >
            <h3 className={styles.contactTitle}>Contact</h3>
            <p className={styles.contactDesc}>
              Sales • Repairs • Custom Builds
              <br />
              Operated by <strong>Robe</strong>, usually replies within 24–48
              hours.
              <br />
              For school project purpose only! demo products.
            </p>

            <div className={styles.contactGrid}>
              <a
                className={styles.contactBtn}
                href="mailto:robeizagani@gmail.com?subject=Order%20Inquiry&body=Hi%20Admin%2C%0A%0AI%27m%20interested%20in%20your%20products.%20Please%20advise%20pricing%20and%20availability."
                target="_blank"
                rel="noopener noreferrer"
              >
                Email
                <span className={styles.contactSub}>robeizagani@gmail.com</span>
              </a>

              <a
                className={styles.contactBtn}
                href="https://mail.google.com/mail/?view=cm&fs=1&to=robeizagani@gmail.com&su=Order%20Inquiry&body=Hi%20Admin%2C%0A%0AI%27m%20interested%20in%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
              >
                Compose in Gmail
                <span className={styles.contactSub}>open gmail</span>
              </a>

              <a className={styles.contactBtn} href="tel:09987654321">
                Call
                <span className={styles.contactSub}>09987654321</span>
              </a>

              <a
                className={styles.contactBtn}
                href="https://wa.me/639998765432?text=Hi%2C%20I%27m%20inquiring%20about%20a%20product"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
                <span className={styles.contactSub}>Chat now</span>
              </a>

              <a
                className={styles.contactBtn}
                href="https://www.facebook.com/Robe.Farol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
                <span className={styles.contactSub}>/Robe.Farol</span>
              </a>

              <Link to="/login-admin" className={styles.contactBtn}>
                Login Admin
              </Link>
            </div>

            <div className={styles.contactFooterRow}>
              <small className={styles.contactNote}>
                Pickup: San Miguel, Sto. Tomas, Batangas · Hours: Mon–Sat
                10:00–19:00
              </small>
              <small className={styles.contactCredit}>
                Operated & developed by Farol, Roberto Jr.
              </small>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
