'use client'

import { useState } from 'react'
import { Plus, Search, Filter, X, Save, Tag, Layers } from 'lucide-react'
import { Teko } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import PlayerCard from '@/components/dashboard/PlayerCard'

const teko = Teko({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

// --- TYPES ---
type Player = {
  id: number
  nom: string
  prenom: string
  categorie: string
  sous_categorie: string
  equipe?: string
  poste?: string
  numero?: string
  note_globale?: number
  photo_url?: string
}

// --- MOCK DATA (Initial) ---
const INITIAL_PLAYERS: Player[] = [
  { id: 1, nom: 'Zidane', prenom: 'Zinedine', categorie: 'SENIORS', sous_categorie: 'R1', equipe: 'Équipe A', poste: 'MOC', numero: '10', note_globale: 98 },
  { id: 2, nom: 'Henry', prenom: 'Thierry', categorie: 'SENIORS', sous_categorie: 'R1', equipe: 'Équipe A', poste: 'BU', numero: '14', note_globale: 94 },
  { id: 3, nom: 'Barthez', prenom: 'Fabien', categorie: 'VETERANS', sous_categorie: 'LOISIR', equipe: 'Vétérans', poste: 'GB', numero: '16', note_globale: 88 },
]

export default function EffectifPage() {
  // STATES
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS)
  const [search, setSearch] = useState('')
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  
  // Form State
  const [formData, setFormData] = useState<Partial<Player>>({
    nom: '', prenom: '', categorie: '', sous_categorie: '', poste: '', numero: ''
  })

  // Handlers
  const handleOpenModal = (player?: Player) => {
    if (player) {
      setEditingPlayer(player)
      setFormData(player)
    } else {
      setEditingPlayer(null)
      setFormData({ nom: '', prenom: '', categorie: 'SENIORS', sous_categorie: '', poste: '', numero: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPlayer(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation d'appel API
    setTimeout(() => {
      if (editingPlayer) {
        // Update logic
        setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? { ...p, ...formData } as Player : p))
      } else {
        // Create logic
        const newPlayer = {
          id: Math.random(),
          ...formData,
          note_globale: 75, // Default
          equipe: 'Nouvelle Recrue'
        } as Player
        setPlayers(prev => [...prev, newPlayer])
      }
      setIsSubmitting(false)
      handleCloseModal()
    }, 800)
  }

  // Filtrage
  const filteredPlayers = players.filter(p => 
    p.nom.toLowerCase().includes(search.toLowerCase()) || 
    p.prenom.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#0065BD] font-bold">Gestion Sportive</span>
          <h1 className={`${teko.className} text-5xl md:text-6xl uppercase leading-[0.9] mt-2 text-black`}>
            Effectif Club
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={() => handleOpenModal()}
                className="bg-[#0065BD] hover:bg-[#00549e] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,101,189,0.3)] hover:shadow-[0_0_30px_rgba(0,101,189,0.5)]"
            >
                <Plus size={16} />
                <span>Nouveau Joueur</span>
            </button>
        </div>
      </div>

      {/* --- FILTERS BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 p-1 bg-black/5 border border-black/10 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Rechercher un joueur (Nom, Prénom)..." 
                className="w-full bg-transparent border-none outline-none text-black pl-12 py-3 placeholder:text-slate-600 font-medium focus:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="w-px bg-black/5 hidden md:block"></div>
        <button className="px-6 py-3 text-slate-400 hover:text-black flex items-center gap-2 font-bold uppercase text-xs tracking-wider transition-colors">
            <Filter size={16} />
            <span>Filtres</span>
        </button>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
                <PlayerCard 
                    key={player.id} 
                    player={player} 
                    onClick={() => handleOpenModal(player)} 
                />
            ))
        ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-black/10 rounded-2xl">
                <p className="text-slate-500 uppercase tracking-widest text-xs">Aucun joueur trouvé</p>
            </div>
        )}
      </div>

      {/* --- MODAL (Fusion Logic + Design) --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                  onClick={handleCloseModal}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                >
                  <div className="h-full w-full">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </div>
                </div>

                {/* Modal Content */}
                <div className="relative bg-white border border-black/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  >
                    {/* Header Modal */}
                    <div className="bg-black/5 px-8 py-6 border-b border-black/10 flex justify-between items-center">
                        <div>
                            <h3 className={`${teko.className} text-3xl uppercase text-black`}>
                                {editingPlayer ? 'Modifier Joueur' : 'Nouveau Joueur'}
                            </h3>
                            <p className="text-xs text-[#0065BD] uppercase tracking-wider font-bold">
                                Dossier Sportif
                            </p>
                        </div>
                        <button onClick={handleCloseModal} className="text-slate-400 hover:text-black transition-colors">
                            <X size={24}/>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Nom</label>
                                <input 
                                    type="text" required 
                                    className="w-full bg-black/5 border border-black/10 rounded-lg p-3 outline-none focus:border-[#0065BD] focus:bg-black/5 transition-all text-black uppercase font-bold"
                                    value={formData.nom} 
                                    onChange={e => setFormData({...formData, nom: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Prénom</label>
                                <input 
                                    type="text" required 
                                    className="w-full bg-black/5 border border-black/10 rounded-lg p-3 outline-none focus:border-[#0065BD] focus:bg-black/5 transition-all text-black capitalize"
                                    value={formData.prenom} 
                                    onChange={e => setFormData({...formData, prenom: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block flex items-center gap-2">
                                    <Tag size={12}/> Catégorie
                                </label>
                                <select 
                                    className="w-full bg-black/5 border border-black/10 rounded-lg p-3 outline-none focus:border-[#0065BD] focus:bg-black/5 transition-all text-black appearance-none cursor-pointer"
                                    value={formData.categorie}
                                    onChange={e => setFormData({...formData, categorie: e.target.value})}
                                >
                                    <option value="U11">U11</option>
                                    <option value="U13">U13</option>
                                    <option value="U15">U15</option>
                                    <option value="U18">U18</option>
                                    <option value="SENIORS">SENIORS</option>
                                    <option value="VETERANS">VETERANS</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block flex items-center gap-2">
                                    <Layers size={12}/> Poste
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="ex: MOC"
                                    className="w-full bg-black/5 border border-black/10 rounded-lg p-3 outline-none focus:border-[#0065BD] focus:bg-black/5 transition-all text-black uppercase"
                                    value={formData.poste}
                                    onChange={e => setFormData({...formData, poste: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-black/10 flex items-center gap-4">
                            <button 
                                type="button"
                                onClick={handleCloseModal}
                                className="flex-1 py-3 rounded-xl border border-black/10 text-slate-400 hover:text-black hover:bg-black/5 text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-[2] bg-[#0065BD] hover:bg-[#00549e] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,101,189,0.25)]"
                            >
                                {isSubmitting ? 'Sauvegarde...' : 'Enregistrer Joueur'}
                                {!isSubmitting && <Save size={16} />}
                            </button>
                        </div>

                    </form>
                  </motion.div>
                </div>
            </div>
        )}
      </AnimatePresence>

    </div>
  )
}