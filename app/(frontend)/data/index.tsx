import { A, B, type FaqCategory, type FaqItem } from "./faq-content";

export type { FaqCategory, FaqCategoryId, FaqItem } from "./faq-content";
import { type Offer } from "../_components/shared/cards/offer-card";
import { type Product } from "../_components/shared/cards/product-card";
import { type Review } from "../_components/shared/cards/review-card";
import { type Step } from "../_components/shared/cards/step-card";
import {
  Gamepad2,
  ShieldCheck,
  Wallet,
  Zap,
  Gift,
  ShoppingCart,
  Undo2,
  UserRound,
} from "lucide-react";

export const offers: Offer[] = [
  {
    id: "wesing",
    title: "5597 Kcoin",
    subtitle: "WeSing Kcoin",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/843.jpg?x-oss-process=image/resize,w_120",
    href: "/shop/wesing",
    discount: 8,
  },
  {
    id: "zepeto",
    title: "58 ZEMs",
    subtitle: "ZEPETO ZEMs & Coins",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/758.jpg?x-oss-process=image/resize,w_120",
    href: "/shop/zepeto",
    discount: 45,
  },
];

export const products: Product[] = [
  {
    id: "1",
    title: "5597 Kcoin",
    subtitle: "WeSing Kcoin",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/1997.jpg?x-oss-process=image/resize,w_120",
    href: "/products/kcoin",
    price: 1200,
    originalPrice: 1500,
    tag: "Promo",
    reviews: 1280,
    orders: 15400,
  },
  {
    id: "2",
    title: "1080 Diamonds",
    subtitle: "Free Fire",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3715.jpg?x-oss-process=image/resize,w_120",
    href: "/products/freefire-diamonds",
    price: 950,
    originalPrice: 1100,
    tag: "Hot",
    reviews: 3420,
    orders: 48200,
  },
  {
    id: "3",
    title: "660 UC",
    subtitle: "PUBG Mobile",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3681.jpg?x-oss-process=image/resize,w_120",
    href: "/products/pubg-uc",
    price: 1450,
    originalPrice: 1600,
    tag: "Promo",
    reviews: 2105,
    orders: 31900,
  },
  {
    id: "4",
    title: "800 Robux",
    subtitle: "Roblox",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3529.jpg?x-oss-process=image/resize,w_120",
    href: "/products/roblox-robux",
    price: 1100,
    reviews: 1760,
    orders: 22800,
  },
  {
    id: "5",
    title: "Weekly Membership",
    subtitle: "Free Fire",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3719.jpg?x-oss-process=image/resize,w_120",
    href: "/products/freefire-weekly",
    price: 175,
    originalPrice: 200,
    tag: "New",
    reviews: 980,
    orders: 12600,
  },
  {
    id: "6",
    title: "300 Lords Mobile Gems",
    subtitle: "Lords Mobile",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3667.jpg?x-oss-process=image/resize,w_120",
    href: "/products/lords-gems",
    price: 640,
    originalPrice: 800,
    tag: "Sale",
    reviews: 410,
    orders: 5300,
  },
  {
    id: "7",
    title: "$10 Gift Card",
    subtitle: "Steam Wallet",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/3285.jpg?x-oss-process=image/resize,w_120",
    href: "/products/steam-10",
    price: 1500,
    reviews: 2890,
    orders: 27400,
  },
  {
    id: "8",
    title: "2800 Genesis Crystals",
    subtitle: "Genshin Impact",
    image:
      "https://seagm-media.seagmcdn.com/icon_400/2237.jpg?x-oss-process=image/resize,w_120",
    href: "/products/genshin-crystals",
    price: 3900,
    originalPrice: 4500,
    tag: "Promo",
    reviews: 1530,
    orders: 9800,
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    username: "sandip_chaudhary62",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    verified: true,
    game: "Free Fire",
  },
  {
    id: "2",
    username: "aarav_gamer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    rating: 4,
    comment:
      "Diamonds arrived in under two minutes. Payment through eSewa was smooth.",
    createdAt: "2026-10-03T10:00:00Z",
    verified: true,
    game: "PUBG Mobile",
  },
  {
    id: "3",
    username: "sujan_karki_99",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "Bought 118 UC for my cousin and it landed in his account while he was still in a match. Support even messaged me on Viber to confirm.",
    createdAt: "2026-10-03T14:25:00Z",
    verified: true,
    game: "PUBG Mobile",
  },
  {
    id: "4",
    username: "prashant_thapa",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    rating: 3,
    comment:
      "Top-up worked but it took almost 25 minutes. Price was better than other sites so I will not complain much, though the delay needs fixing.",
    createdAt: "2026-10-03T08:40:00Z",
    verified: true,
    game: "Free Fire",
  },
  {
    id: "5",
    username: "niraj_adhikari",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "Weekly membership is the best deal I have found here. Bought three in a row and every one activated on the first try.",
    createdAt: "2026-10-02T17:05:00Z",
    verified: true,
    game: "Free Fire",
  },
  {
    id: "6",
    username: "rohan_shah_tv",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    rating: 4,
    comment:
      "Robux came through quickly. Had to send my username for verification, which I think is fair for large orders.",
    createdAt: "2026-10-02T11:15:00Z",
    verified: true,
    game: "Roblox",
  },
  {
    id: "7",
    username: "manisha_rai_ktm",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "Ordered late at night expecting to wait until morning. Got the Kcoins in about 15 minutes. Very happy with the price too.",
    createdAt: "2026-10-01T21:30:00Z",
    verified: true,
    game: "WeSing",
  },
  {
    id: "8",
    username: "deepak_gautam77",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    rating: 2,
    comment:
      "Took longer than expected and I had to open a ticket. They did fix it and refunded the difference, so giving 2 stars only for the wait.",
    createdAt: "2026-10-01T13:50:00Z",
    verified: true,
    game: "Genshin Impact",
  },
  {
    id: "9",
    username: "anisha_bhattarai",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "ZEMs landed instantly. I have bought from three other sites and this one is the cheapest by a good margin.",
    createdAt: "2026-09-30T19:20:00Z",
    verified: false,
    game: "ZEPETO",
  },
  {
    id: "10",
    username: "bikash_ydv",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    rating: 4,
    comment:
      "Gem package was credited fast. I would love to see an option to track the order inside the site instead of waiting for a message.",
    createdAt: "2026-09-30T06:45:00Z",
    verified: true,
    game: "Lords Mobile",
  },
  {
    id: "11",
    username: "sunil_magar12",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    createdAt: "2026-09-29T15:35:00Z",
    verified: true,
    game: "Steam Wallet",
  },
  {
    id: "12",
    username: "priya_sharma_np",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    rating: 4,
    comment:
      "Gift card code arrived straight away and worked on the first try. The rate was better than what my local shop quoted.",
    createdAt: "2026-09-28T12:10:00Z",
    verified: true,
    game: "Steam Wallet",
  },
  {
    id: "13",
    username: "ashish_chand_88",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    rating: 3,
    comment:
      "Order went through fine in the end but I had to confirm my ID twice. Once the verification flow is smoother it will be a proper 5.",
    createdAt: "2026-09-27T09:05:00Z",
    verified: false,
    game: "Roblox",
  },
  {
    id: "14",
    username: "nisha_gurung_01",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "Bought UC for my little brother and tracked the whole thing in the chat. Five stars for the customer service.",
    createdAt: "2026-09-26T16:55:00Z",
    verified: true,
    game: "PUBG Mobile",
  },
  {
    id: "15",
    username: "kiran_lama_ktm",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    rating: 4,
    comment:
      "Price dropped a little compared to last week, which is always nice. Delivery was quick as usual.",
    createdAt: "2026-09-25T10:30:00Z",
    verified: true,
    game: "Free Fire",
  },
  {
    id: "16",
    username: "santosh_khadka",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    rating: 5,
    comment:
      "WeSing Kcoins were the fastest delivery I have had on this site. Honestly did not expect it before ten minutes.",
    createdAt: "2026-09-24T07:20:00Z",
    verified: true,
    game: "WeSing",
  },
];

export const DEFAULT_STEPS: Step[] = [
  {
    icon: Gamepad2,
    title: "Pick a game",
    description: "Choose a game and the package you want.",
  },
  {
    icon: ShieldCheck,
    title: "Enter your ID",
    description: "Your player ID or login, checked before you pay.",
  },
  {
    icon: Wallet,
    title: "Pay locally",
    description: "eSewa, Khalti, bank or your wallet.",
  },
  {
    icon: Zap,
    title: "Get it fast",
    description: "Most orders land in minutes, with a notification.",
  },
];

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "ordering", label: "Ordering", icon: ShoppingCart },
  { id: "paying", label: "Paying", icon: Wallet },
  { id: "delivery", label: "Delivery", icon: Zap },
  { id: "account", label: "Your account", icon: UserRound },
  { id: "refunds", label: "Refunds", icon: Undo2 },
  { id: "rewards", label: "Rewards", icon: Gift },
];

export const FAQ_ITEMS: FaqItem[] = [
  // Ordering
  {
    id: "buy",
    category: "ordering",
    question: "How do I buy a top-up?",
    keywords: "place order purchase checkout cart",
    answer: (
      <>
        Choose your game, select a package and add it to the cart. At checkout,
        fill in your game details, pick a payment method and confirm. We start
        working on it right away.
      </>
    ),
  },
  {
    id: "track",
    category: "ordering",
    question: "Where can I see the status of my order?",
    keywords: "track reference status pending processing completed",
    answer: (
      <>
        Every order gets a reference such as <B>NB-F12345</B>. Open{" "}
        <A href="/account/orders">My Orders</A> to follow it from Pending, to
        Processing, to Completed. You also get a notification once it&apos;s done.
      </>
    ),
  },
  {
    id: "cancel",
    category: "ordering",
    question: "Is it possible to cancel an order?",
    keywords: "cancel stop pending",
    answer: (
      <>
        Only while it&apos;s still <B>Pending</B>. Once we begin processing, it
        can&apos;t be stopped. Message support with your order reference as soon
        as possible and we&apos;ll do what we can.
      </>
    ),
  },
  {
    id: "details",
    category: "ordering",
    question: "Which details does the game need from me?",
    keywords: "uid player id supercell login username free fire pubg roblox",
    answer: (
      <>
        <B>Free Fire and PUBG Mobile</B> need your Player UID,{" "}
        <B>Clash of Clans and Clash Royale</B> need your Supercell ID, and{" "}
        <B>Roblox and TikTok</B> need your account login. Checkout only asks for
        what the game requires. Double-check it before you confirm.
      </>
    ),
  },

  // Paying
  {
    id: "methods",
    category: "paying",
    question: "Which ways can I pay?",
    keywords: "esewa khalti bank wallet npr rupees payment methods",
    answer: (
      <>
        <B>eSewa</B>, <B>Khalti</B>, <B>bank transfer</B> or your{" "}
        <B>Nepbyte Wallet</B>. Everything is charged in Nepali Rupees.
      </>
    ),
  },
  {
    id: "wallet",
    category: "paying",
    question: "How do I load money into my wallet?",
    keywords: "wallet deposit balance add funds",
    answer: (
      <>
        Go to the <A href="/account/deposit">Deposit page</A> and top up with
        eSewa, Khalti or bank. After approval, you can pay at checkout in one
        tap with no screenshot, and wallet payments earn <B>cashback</B>.
      </>
    ),
  },
  {
    id: "screenshot",
    category: "paying",
    question: "What should my payment screenshot show?",
    keywords: "proof receipt upload transaction id",
    answer: (
      <>
        Make sure the <B>transaction ID, amount, date and receiver</B> are all
        visible, then upload it at checkout. Cropped or blurry images slow down
        verification.
      </>
    ),
  },
  {
    id: "secure",
    category: "paying",
    question: "Is paying here secure?",
    keywords: "safe ssl encrypted trust privacy",
    answer: (
      <>
        Yes. The site uses SSL encryption, we never ask for or store banking
        passwords, and payment screenshots are only reviewed by our verified
        team, then deleted once checked.
      </>
    ),
  },

  // Delivery
  {
    id: "speed",
    category: "delivery",
    question: "How soon will my top-up arrive?",
    keywords: "delivery time fast minutes processing",
    answer: (
      <>
        <B>Free Fire</B> orders usually finish within <B>1 to 5 minutes</B>.
        PUBG, Clash of Clans, Roblox and TikTok typically take{" "}
        <B>5 to 30 minutes</B>, and a little longer at busy times.
      </>
    ),
  },
  {
    id: "missing",
    category: "delivery",
    question: "I've paid, but nothing has arrived",
    keywords: "not received missing late delayed",
    answer: (
      <>
        Check <A href="/account/orders">My Orders</A> first. If it says{" "}
        <B>Processing</B>, we&apos;re already on it. If nothing changes after 2
        hours, message support with your order reference and payment proof.
      </>
    ),
  },
  {
    id: "wrong-id",
    category: "delivery",
    question: "I typed the wrong player ID. What can I do?",
    keywords: "wrong uid mistake incorrect id",
    answer: (
      <>
        Contact us right away. If the order hasn&apos;t been processed yet, we
        can fix the ID. Once it has been delivered to another account, it
        can&apos;t be recovered, so verify your ID in-game before ordering.
      </>
    ),
  },

  // Account
  {
    id: "signup",
    category: "account",
    question: "Do I have to sign up before ordering?",
    keywords: "register create account sign up",
    answer: (
      <>
        Yes, but it&apos;s free and takes under a minute. An account lets you track
        orders, use the wallet and collect points and cashback.{" "}
        <A href="/auth/register">Create yours here</A>.
      </>
    ),
  },
  {
    id: "password",
    category: "account",
    question: "How do I reset a forgotten password?",
    keywords: "forgot password reset login email",
    answer: (
      <>
        Open the <A href="/auth/login">login page</A>, tap{" "}
        <B>Forgot password</B> and enter your email. If the reset link
        doesn&apos;t
        show up, look in your spam folder.
      </>
    ),
  },

  // Refunds
  {
    id: "refund-policy",
    category: "refunds",
    question: "When do you issue refunds?",
    keywords: "refund policy money back double payment",
    answer: (
      <>
        We refund orders that weren&apos;t delivered within 24 hours, orders where we
        delivered the wrong amount, and duplicate payments. Approved refunds
        land in your <B>Nepbyte Wallet</B> within 24 to 48 hours.
      </>
    ),
  },
  {
    id: "refund-request",
    category: "refunds",
    question: "How do I ask for a refund?",
    keywords: "request refund support contact",
    answer: (
      <>
        Message support with your <B>order reference</B>, a short description of
        the problem and any screenshots. We reply within 24 hours.
      </>
    ),
  },

  // Rewards
  {
    id: "points",
    category: "rewards",
    question: "How do points and tiers work?",
    keywords: "loyalty points tier bronze silver gold platinum",
    answer: (
      <>
        Each completed order earns <B>points</B>. Collect enough to climb from
        Bronze to Silver, Gold and Platinum, with better cashback at every
        level. Track your progress on the{" "}
        <A href="/account/points">Points page</A>.
      </>
    ),
  },
  {
    id: "cashback",
    category: "rewards",
    question: "How is cashback calculated?",
    keywords: "cashback wallet percent boost spin",
    answer: (
      <>
        A share of what you pay returns to your wallet after a successful order.
        The rate depends on your payment method and your tier, and spin wheel
        perks can boost it.
      </>
    ),
  },
  {
    id: "coupon",
    category: "rewards",
    question: "Where do I enter a coupon code?",
    keywords: "coupon promo discount code voucher",
    answer: (
      <>
        Type it into the <B>coupon</B> box at checkout. If the code is valid and
        your cart meets the minimum, the discount applies instantly.
      </>
    ),
  },
];
