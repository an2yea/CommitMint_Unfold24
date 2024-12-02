import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { NFT } from '@/types/nfts'

interface NFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: NFT[] | undefined;
}

export function NFTModal({ isOpen, onClose, nfts }: NFTModalProps) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">My NFTs</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {nfts?.length === 0 ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="col-span-full flex flex-col items-center justify-center text-center p-8"
                    >
                      <ImageOff className="w-16 h-16 mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Uh-oh. No NFTs to show here</h3>
                      <p className="text-muted-foreground">
                        Complete some habits and come back here. Go, Commit-Mint!
                      </p>
                    </motion.div>
                  ) : (
                    nfts?.map((nft) => (
                      <motion.div
                        key={nft?.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="relative aspect-square">
                              <Image
                                src={nft.image}
                                alt={nft?.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold truncate">{nft?.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{nft?.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    )
  }
  
  

