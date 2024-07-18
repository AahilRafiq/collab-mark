import { Button } from "@/components/ui/button";
interface Props {
    markdown: string;
}

export default function({ markdown }: Props) {

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([markdown], { type: "text/markdown" });
        element.href = URL.createObjectURL(file);
        element.download = "document.md";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return(
        <Button variant="outline" onClick={handleDownload}>
            Download
        </Button>
    )
}