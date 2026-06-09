'use client'

import { getOrganizations, createOrg, editOrg, deleteOrg } from "@/lib/api"
import react from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Inter } from 'next/font/google'
import { Label } from "@/components/ui/label"

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({ name: "", owner_email: "", description: "" })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState("")

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingOrg, setEditingOrg] = useState<any>(null)
  const [editOrgState, setEditOrgState] = useState({ name: "", description: "", status: "Active" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      org.owner?.toLowerCase()?.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations()
      setOrganizations(
        Array.isArray(data?.results)
          ? data.results.map((org: any) => ({
              id: org.id,
              name: org.name,
              owner: org.owner_email,
              members: String(org.member_count),
              credits: String(org.credits_balance),
              status: org.is_active ? "Active" : "Inactive",
              created: format(new Date(org.created_at), "MMMM d, yyyy"),
              description: org.description,
            }))
          : []
      )
    } catch (error) {
      console.error("Failed to load organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrganizations()
  }, [])

  const handleAddOrganization = async () => {
    if (!newOrg.name || !newOrg.owner_email) return
    setAddLoading(true)
    setAddError("")
    try {
      await createOrg(newOrg.name, newOrg.description, newOrg.owner_email)
      setNewOrg({ name: "", owner_email: "", description: "" })
      setAddDialogOpen(false)
      await loadOrganizations()
    } catch (error: any) {
      setAddError(error.message || "Failed to create organization")
    } finally {
      setAddLoading(false)
    }
  }

  const handleOpenEdit = (org: any) => {
    setEditingOrg(org)
    setEditOrgState({
      name: org.name,
      description: org.description || "",
      status: org.status,
    })
    setEditError("")
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingOrg) return
    setEditLoading(true)
    setEditError("")
    try {
      await editOrg(editingOrg.id, editOrgState.name, editOrgState.description, editOrgState.status === "Active")
      setEditDialogOpen(false)
      setEditingOrg(null)
      await loadOrganizations()
    } catch (error: any) {
      setEditError(error.message || "Failed to update organization")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (org: any) => {
    try {
      await deleteOrg(org.id)
      await loadOrganizations()
    } catch (error) {
      console.error("Failed to delete organization:", error)
    }
  }

  return (
    <div className={inter.className}>
      <div className="flex flex-row gap-4 px-8 pt-8 pb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-9 max-w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                All Status
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="All" className={inter.className}>All</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 text-white flex items-center gap-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className={`${inter.className} sm:max-w-sm`}>
              <DialogHeader>
                <DialogTitle>Add Organization</DialogTitle>
                <DialogDescription>Create a new organization.</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Name</Label>
                  <Input
                    id="name-1"
                    value={newOrg.name}
                    placeholder="Organization Name"
                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label htmlFor="owner-1">Owner Email</Label>
                  <Input
                    id="owner-1"
                    value={newOrg.owner_email}
                    placeholder="owner@example.com"
                    onChange={(e) => setNewOrg({ ...newOrg, owner_email: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label htmlFor="desc-1">Description</Label>
                  <Input
                    id="desc-1"
                    value={newOrg.description}
                    placeholder="Description"
                    onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                  />
                </Field>
                {addError && <p className="text-sm text-red-500">{addError}</p>}
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAddOrganization} className="bg-blue-900" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Organization"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={`${inter.className} sm:max-w-sm`}>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>Edit your organization details.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editOrgState.name}
                placeholder="Organization Name"
                onChange={(e) => setEditOrgState({ ...editOrgState, name: e.target.value })}
              />
            </Field>
            <Field>
              <Label htmlFor="edit-desc">Description</Label>
              <Input
                id="edit-desc"
                value={editOrgState.description}
                placeholder="Description"
                onChange={(e) => setEditOrgState({ ...editOrgState, description: e.target.value })}
              />
            </Field>
            <Field>
              <Label>Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {editOrgState.status}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                      value={editOrgState.status}
                      onValueChange={(val) => setEditOrgState({ ...editOrgState, status: val })}
                    >
                      <DropdownMenuRadioItem value="Active" className={inter.className}>Active</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="Inactive" className={inter.className}>Inactive</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
            {editError && <p className="text-sm text-red-500">{editError}</p>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveEdit} className="bg-blue-900" disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-8">
        <div className="border border-border rounded-md overflow-hidden">
          <Table className="w-full text-sm border-collapse">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/50">
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Name</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Owner</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Members</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Credits</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Status</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Created</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.name}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.owner}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.members}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.credits}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <Badge variant={org.status === "Active" ? "default" : "inactive"}>{org.status}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{org.created}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={inter.className}
                            onSelect={() => handleOpenEdit(org)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className={inter.className}
                            onSelect={() => handleDelete(org)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className={`${inter.className} flex items-center justify-center mt-10`}>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select defaultValue="25">
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem className={inter.className} value="10">10</SelectItem>
                <SelectItem className={inter.className} value="25">25</SelectItem>
                <SelectItem className={inter.className} value="50">50</SelectItem>
                <SelectItem className={inter.className} value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}