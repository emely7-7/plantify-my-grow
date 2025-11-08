import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plant } from "@/types/plant";

interface AddPlantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plant: Omit<Plant, "id">) => void;
  editingPlant?: Plant | null;
}

const AddPlantModal = ({ open, onOpenChange, onSave, editingPlant }: AddPlantModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    imageUrl: "",
    wateringFrequency: "7",
    sunlight: "medium",
    status: "healthy",
    lastWatered: new Date().toISOString().split("T")[0],
    location: "",
  });

  useEffect(() => {
    if (editingPlant) {
      setFormData({
        name: editingPlant.name,
        species: editingPlant.species,
        imageUrl: editingPlant.imageUrl,
        wateringFrequency: editingPlant.wateringFrequency.toString(),
        sunlight: editingPlant.sunlight,
        status: editingPlant.status,
        lastWatered: editingPlant.lastWatered.split("T")[0],
        location: editingPlant.location || "",
      });
    } else {
      setFormData({
        name: "",
        species: "",
        imageUrl: "",
        wateringFrequency: "7",
        sunlight: "medium",
        status: "healthy",
        lastWatered: new Date().toISOString().split("T")[0],
        location: "",
      });
    }
  }, [editingPlant, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      sunlight: formData.sunlight as "low" | "medium" | "high",
      status: formData.status as "healthy" | "needs-water" | "normal",
      wateringFrequency: parseInt(formData.wateringFrequency),
      lastWatered: new Date(formData.lastWatered).toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPlant ? "Editar Planta" : "Adicionar Nova Planta"}</DialogTitle>
          <DialogDescription>
            Preencha os dados da sua planta para começar a acompanhá-la
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Planta *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Samambaia da sala"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Espécie *</Label>
            <Input
              id="species"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              placeholder="Ex: Nephrolepis exaltata"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem *</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://exemplo.com/planta.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Sala de estar, Banheiro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wateringFrequency">Rega (dias) *</Label>
              <Input
                id="wateringFrequency"
                type="number"
                min="1"
                value={formData.wateringFrequency}
                onChange={(e) => setFormData({ ...formData, wateringFrequency: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sunlight">Luz Solar *</Label>
              <Select
                value={formData.sunlight}
                onValueChange={(value) => setFormData({ ...formData, sunlight: value })}
              >
                <SelectTrigger id="sunlight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastWatered">Última Rega *</Label>
            <Input
              id="lastWatered"
              type="date"
              value={formData.lastWatered}
              onChange={(e) => setFormData({ ...formData, lastWatered: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Saudável</SelectItem>
                <SelectItem value="needs-water">Precisa de água</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingPlant ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlantModal;
