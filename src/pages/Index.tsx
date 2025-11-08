import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, History, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantCard from "@/components/PlantCard";
import AddPlantModal from "@/components/AddPlantModal";
import PlantDetailsModal from "@/components/PlantDetailsModal";
import Header from "@/components/Header";
import { Plant, CareEvent } from "@/types/plant";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [careHistory, setCareHistory] = useState<CareEvent[]>([]);
  const [viewingPlant, setViewingPlant] = useState<Plant | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const deletedPlantRef = useRef<Plant | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Mock data
    const mockPlants: Plant[] = [
      {
        id: "1",
        name: "Monstera Deliciosa",
        species: "Monstera deliciosa",
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500",
        wateringFrequency: 7,
        sunlight: "medium",
        status: "healthy",
        lastWatered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Sala de estar",
      },
      {
        id: "2",
        name: "Samambaia",
        species: "Nephrolepis exaltata",
        imageUrl: "https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=500",
        wateringFrequency: 3,
        sunlight: "low",
        status: "needs-water",
        lastWatered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Banheiro",
      },
    ];

    const mockHistory: CareEvent[] = [
      {
        id: "1",
        plantId: "1",
        type: "water",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Regada pela manhã",
      },
      {
        id: "2",
        plantId: "2",
        type: "fertilize",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Adicionado fertilizante orgânico",
      },
    ];

    setPlants(mockPlants);
    setCareHistory(mockHistory);
  }, [navigate]);

  const handleSavePlant = (plantData: Omit<Plant, "id">) => {
    if (editingPlant) {
      setPlants(plants.map(p => p.id === editingPlant.id ? { ...plantData, id: editingPlant.id } : p));
      toast.success("Planta atualizada com sucesso!");
      setEditingPlant(null);
    } else {
      const newPlant: Plant = { ...plantData, id: Date.now().toString() };
      setPlants([...plants, newPlant]);
      toast.success("Planta adicionada com sucesso!");
    }
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setIsModalOpen(true);
  };

  const handleDeletePlant = (id: string) => {
    const plantToDelete = plants.find(p => p.id === id);
    if (!plantToDelete) return;

    deletedPlantRef.current = plantToDelete;
    setPlants(plants.filter(p => p.id !== id));

    toast.success("Planta removida", {
      duration: 30000,
      action: {
        label: "Desfazer",
        onClick: () => handleRestorePlant(),
      },
    });
  };

  const handleRestorePlant = () => {
    if (deletedPlantRef.current) {
      setPlants([...plants, deletedPlantRef.current]);
      toast.success("Planta restaurada");
      deletedPlantRef.current = null;
    }
  };

  const handleViewPlant = (plant: Plant) => {
    setViewingPlant(plant);
    setIsDetailsModalOpen(true);
  };

  const getNextWatering = (plant: Plant) => {
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = new Date(lastWatered.getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000);
    return nextWatering;
  };

  const getCareTypeLabel = (type: string) => {
    const labels = {
      water: "Rega",
      fertilize: "Fertilização",
      prune: "Poda",
      repot: "Replantio",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Minhas Plantas</h2>
            <p className="text-muted-foreground">Gerencie e cuide das suas plantas</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg" className="shadow-soft">
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Planta
          </Button>
        </div>

        <Tabs defaultValue="plants" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="plants">Plantas</TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="space-y-6">
            {plants.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 rounded-full bg-muted mb-4">
                  <Leaf className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma planta cadastrada</h3>
                <p className="text-muted-foreground mb-6">Comece adicionando sua primeira planta!</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Planta
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onEdit={handleEditPlant}
                    onDelete={handleDeletePlant}
                    onView={handleViewPlant}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Próximas Regas</h3>
              <div className="space-y-3">
                {plants.map((plant) => {
                  const nextWatering = getNextWatering(plant);
                  const daysUntil = Math.ceil((nextWatering.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
                  
                  return (
                    <div key={plant.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{plant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {nextWatering.toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${daysUntil <= 1 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {daysUntil <= 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil} dias`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Histórico de Cuidados</h3>
              <div className="space-y-3">
                {careHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum registro ainda</p>
                ) : (
                  careHistory.map((event) => {
                    const plant = plants.find(p => p.id === event.plantId);
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{plant?.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {getCareTypeLabel(event.type)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("pt-BR")}
                          </p>
                          {event.notes && (
                            <p className="text-sm mt-1">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AddPlantModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingPlant(null);
        }}
        onSave={handleSavePlant}
        editingPlant={editingPlant}
      />

      <PlantDetailsModal
        plant={viewingPlant}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        careHistory={careHistory}
      />
    </div>
  );
};

export default Index;
