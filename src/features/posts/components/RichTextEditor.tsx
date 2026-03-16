import { useEffect, useCallback, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { createPortal } from "react-dom";
import { Link2, Undo2, Redo2, List, ListOrdered, CodeXml, Italic } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Button from "../../../components/Button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-gray-900 text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something…",
  hasError = false,
}: RichTextEditorProps) {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const linkInputRef = useRef<HTMLInputElement>(null);
  const linkButtonRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[540px] focus:outline-none text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
        const raw = editor.getHTML();
        const clean = DOMPurify.sanitize(raw, {
            ALLOWED_TAGS: [
            "p", "br", "strong", "em", "s", "code", "pre",
            "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote", "a",
            ],
            ALLOWED_ATTR: ["href", "target", "rel", "class"],
        });
        onChange(clean);
        },
  });

  useEffect(() => {
    if (editor && value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const popoverEl = document.getElementById("link-popover-portal");
      if (
        linkButtonRef.current &&
        !linkButtonRef.current.contains(target) &&
        popoverEl &&
        !popoverEl.contains(target)
      ) {
        setLinkPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (linkPopoverOpen) {
      setTimeout(() => linkInputRef.current?.focus(), 50);
    }
  }, [linkPopoverOpen]);

  const openLinkPopover = useCallback(() => {
  if (!editor) return;
  const existing = editor.getAttributes("link").href ?? "";
  setLinkInput(existing);

  if (linkButtonRef.current) {
    const rect = linkButtonRef.current.getBoundingClientRect();
    setPopoverPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
    setTimeout(() => setLinkPopoverOpen((prev) => !prev), 0);
  }
}, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkInput === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const normalized =
        linkInput.startsWith("http://") || linkInput.startsWith("https://")
          ? linkInput
          : `https://${linkInput}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: normalized })
        .run();
    }
    setLinkPopoverOpen(false);
    setLinkInput("");
  }, [editor, linkInput]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPopoverOpen(false);
    setLinkInput("");
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={`flex flex-col rounded-xl border transition ${
        hasError
          ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/20"
          : "border-gray-200 focus-within:border-gray-400"
      } bg-white overflow-hidden`}
    >
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">

        {([1, 2, 3] as const).map((level) => (
          <ToolbarButton
            key={level}
            title={`Heading ${level}`}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive("heading", { level })}
          >
            H{level}
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton title="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <CodeXml size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          ❝
        </ToolbarButton>
        <ToolbarButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          Block
        </ToolbarButton>

        <div ref={linkButtonRef}>
          <ToolbarButton
            title="Link"
            onClick={openLinkPopover}
            active={editor.isActive("link") || linkPopoverOpen}
          >
            <Link2 size={15} />
          </ToolbarButton>
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={15} />
        </ToolbarButton>
      </div>

      {createPortal(
        <div
          id="link-popover-portal"
          style={{ position: "absolute", top: popoverPos.top, left: popoverPos.left, zIndex: 9999, minWidth: "280px" }}
          className={`bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col gap-2 transition-all duration-150 origin-top-left ${
            linkPopoverOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Insert Link
          </p>
          <input
            ref={linkInputRef}
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.stopPropagation(); applyLink(); }
              if (e.key === "Escape") setLinkPopoverOpen(false);
            }}
            placeholder="www.example.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={applyLink}
              className="flex-1 bg-gray-900 text-white text-sm rounded-lg px-3 py-1.5 hover:bg-gray-700 transition"
            >
              Apply
            </Button>
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={removeLink}
                className="flex-1 border border-gray-200 text-sm text-red-500 rounded-lg px-3 py-1.5 hover:bg-red-50 transition"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={() => setLinkPopoverOpen(false)}
              className="flex-1 border border-gray-200 text-sm text-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>,
        document.body
      )}

      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 bg-gray-900 rounded-xl px-2 py-1.5 shadow-xl"
      >
        {[
          { label: <strong>B</strong>, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
          { label: <em>I</em>, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
          { label: <s>S</s>, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike"), title: "Strike" },
          { label: <Link2 size={15} />, action: openLinkPopover, active: editor.isActive("link"), title: "Link" },
        ].map(({ label, action, active, title }) => (
          <button
            key={title}
            type="button"
            title={title}
            onClick={action}
            className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${
              active ? "bg-white text-gray-900" : "text-gray-300 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </BubbleMenu>

      <EditorContent editor={editor} className="flex-1 px-4 py-3 cursor-text" />
    </div>
  );
}
