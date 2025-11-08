import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Sun, Edit, Trash2 } from "lucide-react";
import { Plant } from "@/types/plant";

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
}

const PlantCard = ({ plant, onEdit, onDelete }: PlantCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs-water":
        return "bg-warning text-warning-foreground";
      case "healthy":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "needs-water":
        return "Precisa de água";
      case "healthy":
        return "Saudável";
      default:
        return "Normal";
    }
  };

  return (
    <Card className="hover-lift group overflow-hidden">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{plant.name}</h3>
            <p className="text-sm text-muted-foreground">{plant.species}</p>
          </div>
          <Badge className={getStatusColor(plant.status)}>
            {getStatusText(plant.status)}
          </Badge>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4" />
            <span>A cada {plant.wateringFrequency} dias</span>
          </div>
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4" />
            <span className="capitalize">{plant.sunlight}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Última rega: {new Date(plant.lastWatered).toLocaleDateString("pt-BR")}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(plant)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(plant.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantCard;
