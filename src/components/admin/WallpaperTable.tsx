import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallpaper } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface WallpaperTableProps {
  wallpapers: Wallpaper[];
  onDelete: (id: string) => Promise<void>;
}

const WallpaperTable = ({ wallpapers, onDelete }: WallpaperTableProps) => {
  const [sortField, setSortField] = useState<keyof Wallpaper>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wallpaperToDelete, setWallpaperToDelete] = useState<string | null>(null);
  
  const sortedWallpapers = [...wallpapers].sort((a, b) => {
    if (sortField === "createdAt" || sortField === "updatedAt") {
      const aTime = a[sortField]?.toMillis() || 0;
      const bTime = b[sortField]?.toMillis() || 0;
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    }
    
    // For other fields
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  const handleSort = (field: keyof Wallpaper) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const confirmDelete = (id: string) => {
    setWallpaperToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (wallpaperToDelete) {
      await onDelete(wallpaperToDelete);
      setDeleteDialogOpen(false);
      setWallpaperToDelete(null);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("downloadCount")}
              >
                Downloads {sortField === "downloadCount" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWallpapers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-500">No wallpapers found</p>
                </TableCell>
              </TableRow>
            )}
            
            {sortedWallpapers.map((wallpaper) => (
              <TableRow key={wallpaper.id}>
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded">
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {wallpaper.title}
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {wallpaper.resolution}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{wallpaper.category}</TableCell>
                <TableCell>{formatDate(wallpaper.createdAt)}</TableCell>
                <TableCell>{wallpaper.downloadCount || 0}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/wallpaper/${wallpaper.id}`}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/wallpaper/edit/${wallpaper.id}`}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => confirmDelete(wallpaper.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this wallpaper? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WallpaperTable;
