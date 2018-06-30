import { Component, OnInit } from '@angular/core';

import { ClientsService, Client } from 'app/clients.service';
import { CollectionResource, SingleResource, Link } from 'media-types/common';

@Component({
  selector: 'ui-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

  clients: Promise<CollectionResource<Client>>;

  constructor(private _clients: ClientsService) {
  }

  ngOnInit(): void {
    this._loadClients();
  }

  canRemoveClient(client: SingleResource<Client>): boolean {
    return client.links.some(l => l.relation === 'self' && l.allow.includes('delete'));
  }

  removeClient(client: SingleResource<Client>): void {
    this
      ._clients
      .removeClient(client)
      .then(() => this._loadClients());
  }

  canEditClient(client: SingleResource<Client>): boolean {
    return Boolean(this.getClientEditLink(client));
  }

  getClientEditLink(client: SingleResource<Client>): Link {
    return client.links.find(l => l.relation === 'self' && l.allow.includes('update'));
  }

  canAddClient(clients: CollectionResource<Client>): boolean {
    return Boolean(this.getClientAddLink(clients));
  }

  getClientAddLink(clients: CollectionResource<Client>): Link {
    return clients.links.find(l => l.relation === 'create');
  }

  getAvatarLink(client: SingleResource<Client>): Link {
    return client.links.find(l => l.relation === 'icon');
  }

  private _loadClients(): void {
    this.clients = this._clients.getClients();
  }
}
