import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UploadTips() {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Upload Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc ml-6 text-muted-foreground text-sm">
          <li>Ensure documents are clear and legible for best results</li>
          <li>DICOM files from imaging centers are automatically detected</li>
          <li>All files are encrypted and stored securely</li>
          <li>You can share files with your doctors after uploading</li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default UploadTips;
