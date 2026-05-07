import React from "react";
import "./Dialog.scss";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    bare?: boolean;
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ open, onOpenChange, children, bare }: DialogProps) {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="dialog-overlay" onClick={() => onOpenChange(false)}>
            <div
                className="dialog-container"
                data-bare={bare ? "true" : undefined}
                onClick={(e) => e.stopPropagation()}
            >
                {!bare && (
                    <div className="dialog-close-bar">
                        <button
                            className="dialog-close-btn"
                            onClick={() => onOpenChange(false)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
    return (
        <div className={`dialog-content ${className}`}>
            {children}
        </div>
    );
}
