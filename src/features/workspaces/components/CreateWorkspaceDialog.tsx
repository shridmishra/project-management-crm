import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { createWorkspaceAsync } from "@/features/workspaces/store/workspaceSlice";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Globe, Layout } from "lucide-react";

export default function CreateWorkspaceDialog({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        slug: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) {
            toast.error("You must be logged in to create a workspace");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createWorkspaceAsync({
                ...formData,
                ownerId: session.user.id,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
            })).unwrap();

            toast.success("Workspace created successfully!");
            setFormData({ name: "", description: "", slug: "" });
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to create workspace");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5" /> Create Workspace
                    </DialogTitle>
                    <DialogDescription>
                        Create a new space for your team to collaborate on projects.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="ws-name">Workspace Name</Label>
                        <Input
                            id="ws-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Acme Corp"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ws-slug">Workspace Slug (URL segment)</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="ws-slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="acme-corp"
                                className="pl-9"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Empty will auto-generate from name</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ws-desc">Description</Label>
                        <Textarea
                            id="ws-desc"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What is this workspace about?"
                            className="h-20"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Workspace"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
