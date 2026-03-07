import { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sparkles, Plus, Trash2 } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 250, y: 50 },
    data: { label: "Nicho" },
    type: "input",
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #7B2EFF",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "2",
    position: { x: 250, y: 150 },
    data: { label: "Conteúdo" },
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #2A2A2A",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "3",
    position: { x: 250, y: 250 },
    data: { label: "Formato de Vídeo" },
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #2A2A2A",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "4",
    position: { x: 250, y: 350 },
    data: { label: "Perfil" },
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #2A2A2A",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "5",
    position: { x: 250, y: 450 },
    data: { label: "Oferta" },
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #2A2A2A",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "6",
    position: { x: 250, y: 550 },
    data: { label: "Monetização" },
    type: "output",
    style: {
      background: "#141414",
      color: "#fff",
      border: "1px solid #7B2EFF",
      borderRadius: "8px",
      padding: "10px",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#7B2EFF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "#7B2EFF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "#7B2EFF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    style: { stroke: "#7B2EFF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
    style: { stroke: "#7B2EFF" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
  },
];

export default function Planner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#7B2EFF" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#7B2EFF" },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeLabel = (label: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data = { ...node.data, label };
        }
        return node;
      })
    );
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, label } } : null);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
  };

  const addNewNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position: { x: 400, y: 200 },
      data: { label: 'Novo Elemento' },
      style: { background: '#141414', color: '#fff', border: '1px solid #2A2A2A', borderRadius: '8px', padding: '10px' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const generateStrategy = () => {
    // Mock AI generation
    const newNodes = [
      {
        id: "1",
        position: { x: 250, y: 50 },
        data: { label: "Nicho: Finanças" },
        type: "input",
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #7B2EFF",
          borderRadius: "8px",
          padding: "10px",
        },
      },
      {
        id: "2",
        position: { x: 250, y: 150 },
        data: { label: "Conteúdo: Dicas Rápidas" },
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #2A2A2A",
          borderRadius: "8px",
          padding: "10px",
        },
      },
      {
        id: "3",
        position: { x: 250, y: 250 },
        data: { label: "Formato: Tela Dividida (Gameplay)" },
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #2A2A2A",
          borderRadius: "8px",
          padding: "10px",
        },
      },
      {
        id: "4",
        position: { x: 250, y: 350 },
        data: { label: "Perfil: Voz IA + Legendas" },
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #2A2A2A",
          borderRadius: "8px",
          padding: "10px",
        },
      },
      {
        id: "5",
        position: { x: 250, y: 450 },
        data: { label: "Oferta: E-book Investimentos" },
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #2A2A2A",
          borderRadius: "8px",
          padding: "10px",
        },
      },
      {
        id: "6",
        position: { x: 250, y: 550 },
        data: { label: "Monetização: Link na Bio" },
        type: "output",
        style: {
          background: "#141414",
          color: "#fff",
          border: "1px solid #7B2EFF",
          borderRadius: "8px",
          padding: "10px",
        },
      },
    ];
    setNodes(newNodes);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Planejador Estratégico
          </h1>
          <p className="text-gray-400 mt-1">
            Mapeie o funil do seu perfil dark.
          </p>
        </div>
        <Button variant="neon" onClick={generateStrategy} className="gap-2">
          <Sparkles className="w-4 h-4" />
          GERAR ESTRATÉGIA COM IA
        </Button>
      </div>

      <div className="flex-1 border border-[#2A2A2A] rounded-xl overflow-hidden bg-[#0A0A0A] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          theme="dark"
        >
          <Panel position="top-left" className="bg-[#141414] p-2 rounded-lg border border-[#2A2A2A] flex gap-2">
            <Button variant="outline" size="sm" onClick={addNewNode} className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar Bloco
            </Button>
          </Panel>

          {selectedNode && (
            <Panel position="top-right" className="bg-[#141414] p-4 rounded-lg border border-[#2A2A2A] w-64 space-y-4">
              <h3 className="font-medium text-sm text-gray-300">Editar Bloco</h3>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Texto do Bloco</label>
                <Input 
                  value={selectedNode.data.label} 
                  onChange={(e) => updateNodeLabel(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" onClick={deleteSelectedNode} className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/20">
                <Trash2 className="w-4 h-4 mr-2" /> Excluir Bloco
              </Button>
            </Panel>
          )}

          <Controls className="bg-[#141414] border-[#2A2A2A] fill-white" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === "input") return "#7B2EFF";
              if (n.type === "output") return "#7B2EFF";
              return "#2A2A2A";
            }}
            maskColor="rgba(10, 10, 10, 0.8)"
            className="bg-[#141414] border-[#2A2A2A]"
          />
          <Background color="#2A2A2A" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}
