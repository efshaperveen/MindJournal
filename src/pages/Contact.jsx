import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";

const ContactPage = () => {
    const form = useRef();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_USER_ID
            )
            .then(
                () => {
                    setStatus("success");
                    setLoading(false);
                    toast.success("✅ Message sent! We'll reply soon.");
                    form.current.reset();
                },
                () => {
                    setStatus("error");
                    setLoading(false);
                }
            );
    };

    return (
        <div className="min-h-screen flex flex-col items-center space-y-6 animate-fade-in pt-8 bg-gradient-to-tr from-primary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-accent-950">
            {/* Header Section */}
            <div className="glass-card p-6 rounded-2xl border-gradient mb-2">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                        <FiMail className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                        Contact Us
                    </h1>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300">
                    Got a question or suggestion? Reach out below!
                </p>
            </div>

            {/* Form Section */}
            <form
                ref={form}
                onSubmit={sendEmail}
                className="glass-card p-6 rounded-2xl border-gradient w-full max-w-lg space-y-6"
            >
                <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        name="user_name"
                        required
                        className="input w-full text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 px-4 py-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl focus:outline-none focus:ring-2 ring-primary-400 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="user_email"
                        required
                        className="input w-full text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 px-4 py-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl focus:outline-none focus:ring-2 ring-primary-400 font-medium"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                        Message
                    </label>
                    <textarea
                        name="message"
                        required
                        rows="4"
                        className="input w-full text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 px-4 py-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl focus:outline-none focus:ring-2 ring-secondary-400 font-medium resize-none"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary mt-2 w-full flex items-center justify-center space-x-2 hover:shadow-glow transition duration-200 font-bold py-3 rounded-xl"
                >
                    <FiMail size={18} />
                    <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
                {status === "success" && (
                    <div className="mt-4 p-3 rounded-lg bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400 text-center font-medium animate-fade-in">
                        ✅ Message sent! We'll reply soon.
                    </div>
                )}
                {status === "error" && (
                    <div className="mt-4 p-3 rounded-lg bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400 text-center font-medium animate-fade-in">
                        ❌ Something went wrong. Please try again.
                    </div>
                )}
            </form>
        </div>
    );
};

export default ContactPage;
