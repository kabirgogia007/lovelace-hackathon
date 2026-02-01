
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, WalletNode } from '../types';
import { COLORS } from '../constants';

interface GraphCanvasProps {
  data: GraphData;
  onNodeClick: (node: WalletNode) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ data, onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<any, any> | undefined>(undefined);
  const offsetRef = useRef<number>(0);

  // Handle Resize and High DPI
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    setupCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Enhanced Simulation for "Smurfing" Clusters
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links as any).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => 35))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    const drawArrow = (c: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, radius: number) => {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headlen = 10;
      const adjustedToX = toX - (radius + 2) * Math.cos(angle);
      const adjustedToY = toY - (radius + 2) * Math.sin(angle);

      c.beginPath();
      c.moveTo(adjustedToX, adjustedToY);
      c.lineTo(adjustedToX - headlen * Math.cos(angle - Math.PI / 6), adjustedToY - headlen * Math.sin(angle - Math.PI / 6));
      c.lineTo(adjustedToX - headlen * Math.cos(angle + Math.PI / 6), adjustedToY - headlen * Math.sin(angle + Math.PI / 6));
      c.closePath();
      c.fill();
    };

    const render = () => {
      // CRITICAL FIX: Clear the entire canvas every frame to prevent smudging
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw Edges
      offsetRef.current = (offsetRef.current + 0.1) % 20;
      data.links.forEach((link: any) => {
        const isDangerous = link.source.suspicionScore > 60 || link.target.suspicionScore > 60;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.strokeStyle = isDangerous ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isDangerous ? 2 : 1;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -offsetRef.current;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = isDangerous ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.1)';
        drawArrow(ctx, link.source.x, link.source.y, link.target.x, link.target.y, 15);
      });

      // Draw Nodes
      data.nodes.forEach((node: any) => {
        const color = node.type === 'illicit' ? COLORS.illicit : 
                      node.type === 'mule' ? COLORS.mule : COLORS.clean;
        
        const radius = 12 + (node.suspicionScore / 12);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        
        // Node styling
        ctx.fillStyle = color;
        if (node.suspicionScore > 70) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        
        // Border ring
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ID Labels
        ctx.fillStyle = 'white';
        ctx.font = `bold ${radius > 15 ? '12px' : '10px'} Space Grotesk`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 15);
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '8px Space Grotesk';
        ctx.fillText(node.wallet_score.toFixed(1), node.x, node.y + radius + 25);
      });

      ctx.restore();
    };

    simulation.on('tick', render);

    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', (event) => {
        setTransform(event.transform);
        render();
      });

    d3.select(canvas).call(zoom as any);

    window.addEventListener('resize', setupCanvas);
    return () => {
      simulation.stop();
      window.removeEventListener('resize', setupCanvas);
    };
  }, [data, transform]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - transform.x) / transform.k;
    const y = (e.clientY - rect.top - transform.y) / transform.k;

    const clickedNode = data.nodes.find((node: any) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 25;
    });

    if (clickedNode) onNodeClick(clickedNode);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default GraphCanvas;
