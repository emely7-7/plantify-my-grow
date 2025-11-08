import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Sun, MapPin, Calendar } from "lucide-react";
import { Plant, CareEvent } from "@/types/plant";

interface PlantDetailsModalProps {
  plant: Plant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careHistory: CareEvent[];
  onWater: (plantId: string) => void;
}

const PlantDetailsModal = ({ plant, open, onOpenChange, careHistory, onWater }: PlantDetailsModalProps) => {
  const [timeSinceWatering, setTimeSinceWatering] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!plant) return;

    const updateTime = () => {
      const now = Date.now();
      const lastWatered = new Date(plant.lastWatered).getTime();
      const diff = now - lastWatered;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeSinceWatering({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [plant]);

  if (!plant) return null;

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

  const getSunlightText = (sunlight: string) => {
    switch (sunlight) {
      case "low":
        return "Pouca luz";
      case "medium":
        return "Luz moderada";
      case "high":
        return "Muita luz";
      default:
        return sunlight;
    }
  };

  const plantCareHistory = careHistory
    .filter(event => event.plantId === plant.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const waterHistory = plantCareHistory.filter(event => event.type === "water");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Planta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Button 
            onClick={() => {
              onWater(plant.id);
            }}
            className="w-full"
            size="lg"
          >
            <Droplets className="w-5 h-5 mr-2" />
            Regar Agora
          </Button>
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">{plant.name}</h3>
                <p className="text-muted-foreground">{plant.species}</p>
              </div>
              <Badge className={getStatusColor(plant.status)}>
                {getStatusText(plant.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Frequência de rega</p>
                  <p className="text-muted-foreground">A cada {plant.wateringFrequency} dias</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Sun className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Luz solar</p>
                  <p className="text-muted-foreground">{getSunlightText(plant.sunlight)}</p>
                </div>
              </div>

              {plant.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Localização</p>
                    <p className="text-muted-foreground">{plant.location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tempo desde a última rega
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center mt-3">
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{timeSinceWatering.days}</p>
                  <p className="text-xs text-muted-foreground">Dias</p>
                </div>
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{timeSinceWatering.hours}</p>
                  <p className="text-xs text-muted-foreground">Horas</p>
                </div>
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{timeSinceWatering.minutes}</p>
                  <p className="text-xs text-muted-foreground">Minutos</p>
                </div>
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{timeSinceWatering.seconds}</p>
                  <p className="text-xs text-muted-foreground">Segundos</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Histórico de Regas</h4>
              {waterHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma rega registrada
                </p>
              ) : (
                <div className="space-y-2">
                  {waterHistory.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {event.notes && (
                          <p className="text-sm mt-1">{event.notes}</p>
                        )}
                      </div>
                      <Droplets className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {plantCareHistory.filter(e => e.type !== "water").length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Outros Cuidados</h4>
                <div className="space-y-2">
                  {plantCareHistory
                    .filter(event => event.type !== "water")
                    .map((event) => {
                      const labels = {
                        fertilize: "Fertilização",
                        prune: "Poda",
                        repot: "Replantio",
                      };
                      return (
                        <div key={event.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {labels[event.type as keyof typeof labels] || event.type}
                            </span>
                            <span className="text-sm font-medium">
                              {new Date(event.date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          {event.notes && (
                            <p className="text-sm mt-1">{event.notes}</p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlantDetailsModal;
