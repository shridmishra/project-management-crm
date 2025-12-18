import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const project = currentWorkspace?.projects.find((p) => p.id === id);
    const projectMembersEmails = project?.members.map((member) => member.user.email) || [];

    const [email, setEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" /> Add Member to Project
                    </DialogTitle>
                    <DialogDescription>
                        {currentWorkspace && project && (
                            <span>Adding to Project: <span className="text-primary font-medium">{project.name}</span></span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Select 
                                value={email} 
                                onValueChange={(value) => setEmail(value)}
                            >
                                <SelectTrigger className="pl-9">
                                    <SelectValue placeholder="Select a member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentWorkspace?.members
                                        .filter((member) => !projectMembersEmails.includes(member.user.email))
                                        .map((member) => (
                                            <SelectItem key={member.user.id} value={member.user.email}>
                                                {member.user.email}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isAdding || !currentWorkspace}>
                            {isAdding ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProjectMember;
