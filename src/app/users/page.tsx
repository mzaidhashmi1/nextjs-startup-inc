'use client'

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
import { useEffect } from "react"
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
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Plus } from "lucide-react"
import { Inter } from 'next/font/google'
import { Label } from "@/components/ui/label"
import { getUsers, createUser, editUserRole, deleteUser } from "@/lib/api"

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState("")

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editRole, setEditRole] = useState("user")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const loadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(
        Array.isArray(data?.results)
          ? data.results.map((user: any) => ({
              id: user.id,
              name: user.name,
              owner: user.email,
              membership: String(user.memberships?.length ?? 0),
              super: user.is_superuser ? "Super" : "User",
              status: user.is_active ? "Active" : "Inactive",
              created: format(new Date(user.date_joined), "MMMM d, yyyy"),
            }))
          : []
      )
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return
    setAddLoading(true)
    setAddError("")
    try {
      await createUser(newUser.name, newUser.email, newUser.password, newUser.role)
      setNewUser({ name: "", email: "", password: "", role: "user" })
      setAddDialogOpen(false)
      await loadUsers()
    } catch (error: any) {
      setAddError(error.message || "Failed to create user")
    } finally {
      setAddLoading(false)
    }
  }

  const handleOpenEdit = (user: any) => {
    setEditingUser(user)
    setEditRole(user.super === "Super" ? "owner" : "user")
    setEditError("")
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    setEditLoading(true)
    setEditError("")
    try {
      await editUserRole(editingUser.id, editRole)
      setEditDialogOpen(false)
      setEditingUser(null)
      await loadUsers()
    } catch (error: any) {
      setEditError(error.message || "Failed to update user")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (user: any) => {
    try {
      await deleteUser(user.id)
      await loadUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
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
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 text-white flex items-center gap-2">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className={`${inter.className} sm:max-w-sm`}>
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>Create a new user in your organization.</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    value={newUser.name}
                    placeholder="Full Name"
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    value={newUser.email}
                    placeholder="user@example.com"
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newUser.password}
                    placeholder="Password"
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </Field>
                <Field>
                  <Label>Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {newUser.role}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-32">
                      <DropdownMenuGroup>
                        <DropdownMenuRadioGroup value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                          <DropdownMenuRadioItem value="owner" className={inter.className}>Owner</DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioItem value="admin" className={inter.className}>Admin</DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioItem value="user" className={inter.className}>User</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>
                {addError && <p className="text-sm text-red-500">{addError}</p>}
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAddUser} className="bg-blue-900" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className={`${inter.className} sm:max-w-sm`}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Change the role for {editingUser?.name}.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {editRole}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={editRole} onValueChange={setEditRole}>
                      <DropdownMenuRadioItem value="owner" className={inter.className}>Owner</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="admin" className={inter.className}>Admin</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="user" className={inter.className}>User</DropdownMenuRadioItem>
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
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Email</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Membership</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Super</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Status</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Created</TableHead>
                <TableHead className="py-3 px-4 text-center font-medium text-muted-foreground border border-border">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.name}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.owner}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.membership}</TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">
                      <Badge variant="default">{user.super}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <Badge variant={user.status === "Active" ? "default" : "inactive"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center text-foreground border border-border">{user.created}</TableCell>
                    <TableCell className="py-4 px-4 text-center border border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={inter.className}
                            onSelect={() => handleOpenEdit(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className={inter.className}
                            onSelect={() => handleDelete(user)}
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