import { Ticket } from "../ticket";

it('implements optimistic concurrency control with versioning',async() => {
    // create a ticket instance
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '123'
    })
    // save the ticket to db
    await ticket.save();
    // fetch the ticket twice. Both will have same version
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    // make two separate changes to the tickets we fetched
    firstInstance?.set({price: 20});
    secondInstance?.set({price: 30});
    // save the first fetched ticket. Increments the version
    await firstInstance?.save()
    // save the second fetched ticket and expect an error since it has stale version
    try {
        await secondInstance?.save()
    } catch (error) {
        return;
    }
    throw new Error('Should not reach this point')
})

it('increments the version number on multiple save',async()=>{
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '123'
    })
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})