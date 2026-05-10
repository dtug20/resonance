'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface VoiceCreateDialogProps {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function VoiceCreateDialog({
    children,
    open,
    onOpenChange,
}: VoiceCreateDialogProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
            >
                {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create custom voice</DrawerTitle>
                        <DrawerDescription>
                            Upload or record an audio sample to add a new voice to your library.
                        </DrawerDescription>
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader className="text-left">
                    <DialogTitle>Create custom voice</DialogTitle>
                    <DialogDescription>
                        Upload or record an audio sample to add a new voice to your library.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
};